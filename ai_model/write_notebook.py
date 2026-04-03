import json

def code_cell(id, lines):
    return {"cell_type": "code", "execution_count": None, "id": id,
            "metadata": {}, "outputs": [], "source": lines}

def md_cell(id, text):
    return {"cell_type": "markdown", "id": id, "metadata": {}, "source": text}

cells = [

md_cell("m0", (
    "# InsureGig — Premium Model Training\n"
    "One notebook. Run each cell top to bottom.\n\n"
    "**Cell 1** — Install deps  \n"
    "**Cell 2** — Upload `kaggle.json` (30 sec)  \n"
    "**Cell 3** — Download datasets from Kaggle automatically  \n"
    "**Cell 4** — Encoding maps  \n"
    "**Cell 5** — Clean data  \n"
    "**Cell 6** — Feature engineering  \n"
    "**Cell 7** — Build feature matrix  \n"
    "**Cell 8** — Train model (~2 min)  \n"
    "**Cell 9** — Evaluate  \n"
    "**Cell 10** — Export TF.js model  \n"
    "**Cell 11** — Download zip"
)),

code_cell("c1", [
    "!pip install tensorflowjs kaggle scikit-learn -q\n",
    "print('Done')"
]),

code_cell("c2", [
    "# Go to kaggle.com -> Settings -> API -> Create New Token -> upload kaggle.json here\n",
    "from google.colab import files\n",
    "import os, json\n",
    "uploaded = files.upload()  # select kaggle.json\n",
    "os.makedirs('/root/.config/kaggle', exist_ok=True)\n",
    "os.rename('kaggle.json', '/root/.config/kaggle/kaggle.json')\n",
    "os.chmod('/root/.config/kaggle/kaggle.json', 0o600)\n",
    "print('Kaggle credentials set')"
]),

code_cell("c3", [
    "import os, shutil\n",
    "\n",
    "# Download all 3 datasets\n",
    "!kaggle datasets download -d gauravmalik26/food-delivery-dataset -p /content/ds1 --unzip -q\n",
    "!kaggle datasets download -d cbhavik/swiggyzomato-order-information -p /content/ds2 --unzip -q\n",
    "!kaggle datasets download -d denkuznetz/food-delivery-time-prediction -p /content/ds3 --unzip -q\n",
    "\n",
    "# Show what was downloaded\n",
    "for d in ['/content/ds1', '/content/ds2', '/content/ds3']:\n",
    "    print(d, os.listdir(d))\n",
    "\n",
    "# Copy to working directory with the exact names our code expects\n",
    "# Dataset 1 (Gaurav Malik) — has train.csv\n",
    "shutil.copy('/content/ds1/train.csv', 'train.csv')\n",
    "\n",
    "# Dataset 2 (Swiggy/Zomato rider info) — find the right file\n",
    "ds2_files = os.listdir('/content/ds2')\n",
    "rider_file = [f for f in ds2_files if 'rider' in f.lower() or 'info' in f.lower()]\n",
    "if rider_file:\n",
    "    shutil.copy(f'/content/ds2/{rider_file[0]}', 'Rider-Info.csv')\n",
    "else:\n",
    "    shutil.copy(f'/content/ds2/{ds2_files[0]}', 'Rider-Info.csv')\n",
    "\n",
    "# Dataset 3 (Food delivery times)\n",
    "ds3_files = os.listdir('/content/ds3')\n",
    "fdt_file = [f for f in ds3_files if f.endswith('.csv')][0]\n",
    "shutil.copy(f'/content/ds3/{fdt_file}', 'Food_Delivery_Times.csv')\n",
    "\n",
    "print('\\nReady:', os.listdir('.'))\n",
    "print('train.csv rows:', sum(1 for _ in open('train.csv')))"
]),

code_cell("c4", [
    "import pandas as pd, numpy as np, json, os\n",
    "from math import radians, sin, cos, sqrt, atan2\n",
    "import tensorflow as tf\n",
    "from sklearn.model_selection import train_test_split\n",
    "from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error\n",
    "import matplotlib.pyplot as plt\n",
    "\n",
    "# Encoding maps - MUST match mlEngine.ts exactly\n",
    "CITY_ENC    = {'Metropolitian': 1.0, 'Urban': 0.5, 'Semi-Urban': 0.0}\n",
    "WEATHER_ENC = {'Sunny': 0.0, 'Cloudy': 0.17, 'Windy': 0.33, 'Fog': 0.50, 'Sandstorms': 0.67, 'Stormy': 1.0}\n",
    "TRAFFIC_ENC = {'Low': 0.0, 'Medium': 0.33, 'High': 0.67, 'Jam': 1.0}\n",
    "VEHICLE_ENC = {'electric_scooter': 0.0, 'bicycle': 0.33, 'scooter': 0.67, 'motorcycle': 1.0}\n",
    "TOD_ENC     = {'Morning': 0.0, 'Afternoon': 0.33, 'Evening': 0.67, 'Night': 1.0}\n",
    "BASE_PREMIUM = 49\n",
    "CITY_INCOME  = {'Metropolitian': 700, 'Urban': 550, 'Semi-Urban': 420}\n",
    "CITY_MULT    = {'Metropolitian': 1.40, 'Urban': 1.20, 'Semi-Urban': 1.00}\n",
    "WEATHER_MULT = {'Stormy': 1.60, 'Sandstorms': 1.50, 'Fog': 1.40, 'Windy': 1.10, 'Cloudy': 1.05, 'Sunny': 1.00}\n",
    "TRAFFIC_MULT = {'Jam': 1.50, 'High': 1.30, 'Medium': 1.10, 'Low': 1.00}\n",
    "VEHICLE_MULT = {'bicycle': 1.25, 'scooter': 1.10, 'motorcycle': 1.00, 'electric_scooter': 0.95}\n",
    "print(f'TF {tf.__version__} | Maps defined')"
]),

code_cell("c5", [
    "def haversine_km(lat1,lon1,lat2,lon2):\n",
    "    R=6371; p1,p2=radians(lat1),radians(lat2)\n",
    "    dp,dl=radians(lat2-lat1),radians(lon2-lon1)\n",
    "    a=sin(dp/2)**2+cos(p1)*cos(p2)*sin(dl/2)**2\n",
    "    return R*2*atan2(sqrt(a),sqrt(1-a))\n",
    "\n",
    "df=pd.read_csv('train.csv')\n",
    "df.columns=df.columns.str.strip()\n",
    "for c in df.select_dtypes('object').columns: df[c]=df[c].astype(str).str.strip()\n",
    "df.replace({'NaN':np.nan,'conditions NaN':np.nan},inplace=True)\n",
    "df['Weatherconditions']=df['Weatherconditions'].str.replace('conditions ','',regex=False)\n",
    "df['Time_taken_min']=df['Time_taken(min)'].str.replace('(min) ','',regex=False).astype(float)\n",
    "df['Delivery_person_Age']=pd.to_numeric(df['Delivery_person_Age'],errors='coerce')\n",
    "df['Delivery_person_Ratings']=pd.to_numeric(df['Delivery_person_Ratings'],errors='coerce')\n",
    "df['multiple_deliveries']=pd.to_numeric(df['multiple_deliveries'],errors='coerce').fillna(0).astype(int)\n",
    "df['Festival']=df['Festival'].map({'Yes':1,'No':0}).fillna(0).astype(int)\n",
    "df['Vehicle_condition']=pd.to_numeric(df['Vehicle_condition'],errors='coerce')\n",
    "df.dropna(subset=['City','Weatherconditions','Road_traffic_density','Type_of_vehicle'],inplace=True)\n",
    "for col in ['Delivery_person_Age','Delivery_person_Ratings','Vehicle_condition']:\n",
    "    df[col].fillna(df[col].median(),inplace=True)\n",
    "df['distance_km']=df.apply(lambda r:haversine_km(r['Restaurant_latitude'],r['Restaurant_longitude'],r['Delivery_location_latitude'],r['Delivery_location_longitude']),axis=1)\n",
    "def time_bucket(t):\n",
    "    try:\n",
    "        h=int(str(t).split(':')[0])\n",
    "        if 5<=h<12: return 'Morning'\n",
    "        if 12<=h<17: return 'Afternoon'\n",
    "        if 17<=h<22: return 'Evening'\n",
    "        return 'Night'\n",
    "    except: return 'Afternoon'\n",
    "df['time_of_day']=df['Time_Orderd'].apply(time_bucket)\n",
    "df['is_night_shift']=(df['time_of_day']=='Night').astype(int)\n",
    "print(f'{len(df):,} clean records')"
]),

code_cell("c6", [
    "fdt=pd.read_csv('Food_Delivery_Times.csv').dropna(subset=['Courier_Experience_yrs'])\n",
    "exp_mean,exp_std=fdt['Courier_Experience_yrs'].mean(),fdt['Courier_Experience_yrs'].std()\n",
    "np.random.seed(42)\n",
    "df['experience_yrs']=np.clip(np.random.normal(exp_mean,exp_std,len(df)),0,9)\n",
    "df['experience_tier']=pd.cut(df['experience_yrs'],bins=[-0.1,1,3,6,9],labels=[0,1,2,3]).astype(float)\n",
    "df['daily_income_inr']=(df['City'].map(CITY_INCOME).fillna(500)+df['multiple_deliveries']*80+df['Festival']*150+df['is_night_shift']*80-(2-df['Vehicle_condition'])*30).clip(lower=200)\n",
    "def compute_premium(r):\n",
    "    p=BASE_PREMIUM\n",
    "    p*=CITY_MULT.get(r['City'],1.15); p*=WEATHER_MULT.get(r['Weatherconditions'],1.05)\n",
    "    p*=TRAFFIC_MULT.get(r['Road_traffic_density'],1.10); p*=VEHICLE_MULT.get(r['Type_of_vehicle'],1.00)\n",
    "    p*={0:1.00,1:1.15,2:1.25,3:1.30}.get(min(int(r['multiple_deliveries']),3),1.00)\n",
    "    p*=(1.20 if r['Festival'] else 1.00)\n",
    "    age=r['Delivery_person_Age']\n",
    "    p*=1.20 if age<22 else (1.10 if age>45 else (1.10 if age>35 else 1.00))\n",
    "    p*=0.90 if r['Delivery_person_Ratings']>4.5 else (1.15 if r['Delivery_person_Ratings']<4.0 else 1.00)\n",
    "    p*=(1.25 if r['is_night_shift'] else 1.00)\n",
    "    p*={0:1.20,1:1.10,2:1.00,3:0.90}.get(int(r['experience_tier']),1.00)\n",
    "    return round(p,2)\n",
    "df['premium_inr']=df.apply(compute_premium,axis=1)\n",
    "print(f\"Premium | Min:{df['premium_inr'].min():.0f}  Max:{df['premium_inr'].max():.0f}  Mean:{df['premium_inr'].mean():.0f}\")"
]),

code_cell("c7", [
    "def build_features(row):\n",
    "    return [\n",
    "        (row['Delivery_person_Age']-15)/45.0,\n",
    "        (row['Delivery_person_Ratings']-1.0)/4.0,\n",
    "        row['Vehicle_condition']/3.0,\n",
    "        min(row['multiple_deliveries'],3)/3.0,\n",
    "        float(row['Festival']),\n",
    "        float(row['is_night_shift']),\n",
    "        min(row['distance_km'],30.0)/30.0,\n",
    "        row['experience_tier']/3.0,\n",
    "        CITY_ENC.get(row['City'],0.5),\n",
    "        WEATHER_ENC.get(row['Weatherconditions'],0.33),\n",
    "        TRAFFIC_ENC.get(row['Road_traffic_density'],0.33),\n",
    "        VEHICLE_ENC.get(row['Type_of_vehicle'],0.5),\n",
    "        TOD_ENC.get(row['time_of_day'],0.33),\n",
    "        min(row['daily_income_inr'],1200)/1200.0,\n",
    "    ]\n",
    "X=np.array(df.apply(build_features,axis=1).tolist(),dtype=np.float32)\n",
    "y=df['premium_inr'].values.astype(np.float32)\n",
    "X_train,X_test,y_train,y_test=train_test_split(X,y,test_size=0.2,random_state=42)\n",
    "print(f'Features {X.shape} | Train {len(X_train):,} | Test {len(X_test):,}')"
]),

code_cell("c8", [
    "tf.random.set_seed(42)\n",
    "model=tf.keras.Sequential([\n",
    "    tf.keras.layers.Input(shape=(14,)),\n",
    "    tf.keras.layers.Dense(64,activation='relu'),\n",
    "    tf.keras.layers.BatchNormalization(),\n",
    "    tf.keras.layers.Dense(32,activation='relu'),\n",
    "    tf.keras.layers.Dense(16,activation='relu'),\n",
    "    tf.keras.layers.Dense(1,activation='linear'),\n",
    "],name='InsureGig_PremiumModel')\n",
    "model.compile(optimizer=tf.keras.optimizers.Adam(0.001),loss='mse',metrics=['mae'])\n",
    "model.summary()\n",
    "history=model.fit(X_train,y_train,validation_split=0.1,epochs=80,batch_size=256,\n",
    "    callbacks=[\n",
    "        tf.keras.callbacks.EarlyStopping(monitor='val_loss',patience=10,restore_best_weights=True),\n",
    "        tf.keras.callbacks.ReduceLROnPlateau(monitor='val_loss',factor=0.5,patience=5,verbose=1)\n",
    "    ],verbose=1)\n",
    "print('Training complete')"
]),

code_cell("c9", [
    "preds=model.predict(X_test).flatten()\n",
    "rmse=float(np.sqrt(mean_squared_error(y_test,preds)))\n",
    "mae=float(mean_absolute_error(y_test,preds))\n",
    "r2=float(r2_score(y_test,preds))\n",
    "print(f'RMSE Rs{rmse:.2f} | MAE Rs{mae:.2f} | R2 {r2:.4f}')\n",
    "fig,axes=plt.subplots(1,2,figsize=(12,4))\n",
    "axes[0].plot(history.history['loss'],label='Train'); axes[0].plot(history.history['val_loss'],label='Val')\n",
    "axes[0].set_title('Loss Curve'); axes[0].legend()\n",
    "sample=np.random.choice(len(y_test),300,replace=False)\n",
    "axes[1].scatter(y_test[sample],preds[sample],alpha=0.4,s=10,color='#6366F1')\n",
    "axes[1].plot([y_test.min(),y_test.max()],[y_test.min(),y_test.max()],'r--')\n",
    "axes[1].set_xlabel('Actual'); axes[1].set_ylabel('Predicted')\n",
    "axes[1].set_title('Predicted vs Actual Premium')\n",
    "plt.tight_layout(); plt.show()"
]),

code_cell("c10", [
    "import tensorflowjs as tfjs\n",
    "os.makedirs('premium_model',exist_ok=True)\n",
    "tfjs.converters.save_keras_model(model,'premium_model')\n",
    "config={\n",
    "    'feature_names':['age','ratings','vehicle_condition','multiple_deliveries','festival',\n",
    "        'is_night_shift','distance_km','experience_tier','city','weather','traffic',\n",
    "        'vehicle','time_of_day','daily_income'],\n",
    "    'normalization':{'age':{'min':15,'max':60},'ratings':{'min':1.0,'max':5.0},\n",
    "        'vehicle_condition':{'min':0,'max':3},'multiple_deliveries':{'min':0,'max':3},\n",
    "        'distance_km':{'min':0,'max':30},'experience_tier':{'min':0,'max':3},\n",
    "        'daily_income':{'min':0,'max':1200}},\n",
    "    'encodings':{'city':CITY_ENC,'weather':WEATHER_ENC,'traffic':TRAFFIC_ENC,\n",
    "        'vehicle':VEHICLE_ENC,'time_of_day':TOD_ENC},\n",
    "    'city_base_income':{'Metropolitian':700,'Urban':550,'Semi-Urban':420},\n",
    "    'base_premium':49,\n",
    "    'model_info':{'trained_on':f'{len(df):,} real Indian delivery records',\n",
    "        'rmse_inr':round(rmse,2),'mae_inr':round(mae,2),'r2':round(r2,4)}\n",
    "}\n",
    "with open('premium_model/model_config.json','w') as f: json.dump(config,f,indent=2)\n",
    "print('Exported:')\n",
    "for fname in os.listdir('premium_model'):\n",
    "    print(f'  {fname}  ({os.path.getsize(\"premium_model/\"+fname)/1024:.1f} KB)')"
]),

code_cell("c11", [
    "import shutil\n",
    "from google.colab import files\n",
    "shutil.make_archive('premium_model','zip','.','premium_model')\n",
    "files.download('premium_model.zip')\n",
    "print('Downloaded!')\n",
    "print('Extract the zip and place the premium_model folder at:')\n",
    "print('  D:/GigInc/public/premium_model/')\n",
    "print('Required: model.json | group1-shard1of1.bin | model_config.json')"
]),

]

nb = {
    "nbformat": 4,
    "nbformat_minor": 5,
    "metadata": {
        "colab": {"provenance": []},
        "kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"},
        "language_info": {"name": "python", "version": "3.10.0"}
    },
    "cells": cells
}

with open('D:/GigInc/InsureGig_Colab.ipynb', 'w') as f:
    json.dump(nb, f, indent=1)

print('Notebook written successfully')
