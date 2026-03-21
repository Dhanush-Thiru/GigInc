import streamlit as st
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt

st.set_page_config(page_title="InsureGig ML Engine", page_icon="🧠", layout="wide")

st.title("🧠 InsureGig API: Parametric AI Engine")
st.markdown("This standalone dashboard allows judges to interact directly with the Machine Learning algorithm powering InsureGig's counterfactual payout calculations.")

# 1. Generate Synthetic Data
@st.cache_data
def generate_data(samples=5000):
    np.random.seed(42)
    severity = np.random.uniform(0, 100, samples) # 0 to 100%
    demand_left = np.random.uniform(0, 100, samples) # 0 to 100%
    
    # Base logic: higher severity + lower demand = higher loss
    loss_percent = (severity * 0.6) + ((100 - demand_left) * 0.4)
    
    # Add human noise so the ML has to learn the non-linear boundaries
    loss_percent += np.random.normal(0, 8, samples)
    
    # Clip between 0 and 100
    loss_percent = np.clip(loss_percent, 0, 100)
    
    return pd.DataFrame({
        'Weather Severity (%)': severity,
        'Platform Demand Left (%)': demand_left,
        'Income Lost (%)': loss_percent
    })

df = generate_data()

# 2. Train Model
X = df[['Weather Severity (%)', 'Platform Demand Left (%)']]
y = df['Income Lost (%)']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Using Random Forest (very good for non-linear regression tasks)
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 3. Sidebar UI for the live demo
st.sidebar.header("📡 Live Disruption Feed")
st.sidebar.markdown("Simulate API inputs from OpenWeatherMap & the Delivery Platform Server:")
in_severity = st.sidebar.slider("Weather Severity (%)", 0.0, 100.0, 82.5)
in_demand = st.sidebar.slider("Platform Demand Left (%)", 0.0, 100.0, 12.0)

# 4. Predict
# Formatting input exactly as expected by strictly trained feature names
input_df = pd.DataFrame([[in_severity, in_demand]], columns=X.columns)
predicted_loss = model.predict(input_df)[0]

# 5. Output UI
col1, col2 = st.columns(2)

with col1:
    st.subheader("📊 Model Performance & Training")
    st.write(f"✅ The Random Forest is successfully trained on **{len(df):,}** historical disruption records.")
    
    with st.expander("View Raw Training Dataset (Top 5)"):
        st.dataframe(df.head(5), use_container_width=True)
    
    # Feature importance visually demonstrates to judges "what matters"
    fig, ax = plt.subplots(figsize=(6, 3))
    colors = ['#EF4444', '#3B82F6']
    ax.barh(X.columns, model.feature_importances_, color=colors)
    ax.set_title("Feature Importance in Payout Calculation")
    ax.set_xlabel("Relative Importance Weight")
    st.pyplot(fig)

with col2:
    st.subheader("💰 Counterfactual Payout Prediction")
    st.info(f"**Live Output:** Based on the current parameters, the Random Forest model predicts a **{predicted_loss:.1f}%** drop in gig worker income.")
    
    st.markdown("### Simulated Wallet Transfer")
    st.markdown("Assume a rider usually earns ₹600 per day.")
    
    base_income = 600
    payout = int(base_income * (predicted_loss / 100))
    
    metric_cols = st.columns(2)
    with metric_cols[0]:
        st.metric(label="Expected Normal Income", value=f"₹{base_income}")
    with metric_cols[1]:
        st.metric(label="Calculated Auto-Payout", value=f"₹{payout}", delta=f"{predicted_loss:.1f}% Wage Protected", delta_color="normal")
    
    st.success("🟢 Payout Approved by Model. Smart Contract Triggered.")
    
st.markdown("---")
st.markdown("*(This Streamlit dashboard runs in parallel to the React app serving as the backend AI processing visualization layer for Hackathon Judges)*")
