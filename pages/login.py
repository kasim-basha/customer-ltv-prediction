import streamlit as st
from auth_google import google_login

from auth import (
    register_user,
    login_user,
    generate_reset_code,
    save_reset_code,
    verify_reset_code,
    reset_password,
    update_profile
)

# -----------------------------------
# PAGE CONFIG
# -----------------------------------
st.set_page_config(
    page_title="Customer LTV Authentication",
    page_icon="🔐",
    layout="centered"
)

st.markdown(
    """
    <style>
    .stApp {
        background: linear-gradient(180deg, #0b1120 0%, #111827 100%);
        color: #f8fafc;
    }
    .css-18e3th9 {
        background: rgba(15, 23, 42, 0.86) !important;
        box-shadow: 0 30px 90px rgba(0, 0, 0, 0.28);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 24px;
    }
    .stTextInput>div>div>input,
    .stTextInput>div>div>textarea,
    .stNumberInput>div>div>input {
        background: #0f172a !important;
        color: #f8fafc !important;
        border: 1px solid rgba(255, 255, 255, 0.16) !important;
        border-radius: 14px !important;
    }
    .stButton>button {
        background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%) !important;
        color: #fff !important;
        border: none !important;
        border-radius: 14px !important;
        padding: 12px 18px !important;
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.22);
    }
    .stButton>button:hover {
        opacity: 0.95;
        transform: translateY(-1px);
    }
    .auth-hero {
        padding: 1.2rem 1.4rem;
        border-radius: 20px;
        background: rgba(37, 99, 235, 0.16);
        border: 1px solid rgba(255, 255, 255, 0.08);
        margin-bottom: 1rem;
    }
    .auth-hero h2 {
        margin: 0;
        color: #f8fafc;
    }
    .auth-hero p {
        color: #cbd5e1;
        margin-top: 0.5rem;
    }
    .auth-section {
        background: rgba(255, 255, 255, 0.02);
        border-radius: 18px;
        padding: 1rem 1.2rem;
        border: 1px solid rgba(255, 255, 255, 0.08);
        margin-bottom: 1rem;
    }
    .auth-section h4 {
        margin-bottom: 0.75rem;
        color: #f8fafc;
    }
    .stSidebar {
        background: linear-gradient(180deg, #0f172a 0%, #111827 100%) !important;
        border-radius: 20px;
        padding: 1rem;
    }
    </style>
    """,
    unsafe_allow_html=True
)

# -----------------------------------
# SESSION STATE
# -----------------------------------
if "logged_in" not in st.session_state:
    st.session_state.logged_in = False

if "username" not in st.session_state:
    st.session_state.username = ""

if "user_id" not in st.session_state:
    st.session_state.user_id = None

# -----------------------------------
# TITLE
# -----------------------------------
st.title("🔐 Customer LTV Authentication")
st.markdown("---")
st.markdown(
    """
    <div class='auth-hero'>
        <h2>Secure access to your Customer LTV dashboard</h2>
        <p>Login or register to explore predictions, analytics, and business insights with an elegant interface.</p>
    </div>
    """,
    unsafe_allow_html=True
)

# -----------------------------------
# MENU
# -----------------------------------
menu = st.sidebar.selectbox(
    "Select Option",
    [
        "Login",
        "Register",
        "Forgot Password",
        "Edit Profile"
    ]
)

# ===================================
# REGISTER
# ===================================
if menu == "Register":

    st.subheader("📝 Create Account")

    name = st.text_input(
        "Full Name"
    )

    mobile = st.text_input(
        "Mobile Number"
    )

    password = st.text_input(
        "Password",
        type="password"
    )

    confirm_password = st.text_input(
        "Confirm Password",
        type="password"
    )

    if st.button("Register"):

        if not name:

            st.error(
                "Please enter your name"
            )

        elif not mobile:

            st.error(
                "Please enter mobile number"
            )

        elif password != confirm_password:

            st.error(
                "Passwords do not match"
            )

        else:

            try:

                success = register_user(
                    name,
                    mobile,
                    password
                )

                if success:

                    st.success(
                        "Registration Successful!"
                    )

                else:

                    st.error(
                        "Mobile Number Already Exists"
                    )

            except Exception as e:

                st.error(
                    f"Error: {e}"
                )

# ===================================
# LOGIN
# ===================================
elif menu == "Login":

    st.markdown(
        """
        <h1 style='text-align:center;'>
        🔐 Welcome
        </h1>

        <h4 style='text-align:center;color:gray;'>
        Sign in to access Customer LTV Dashboard
        </h4>
        """,
        unsafe_allow_html=True
    )

    # -----------------------------------
    # GOOGLE LOGIN
    # -----------------------------------
    st.subheader("🔵 Continue with Google")

    try:

        google_result = google_login()

        if google_result:

            st.session_state.logged_in = True

            if isinstance(google_result, dict):

                st.session_state.username = google_result.get(
                    "name",
                    "Google User"
                )

                if "id" in google_result:
                    st.session_state.user_id = google_result["id"]

            else:

                st.session_state.username = "Google User"

            st.success(
                "Google Login Successful!"
            )

            st.switch_page("app.py")

    except Exception as e:

        st.warning(
            f"Google Login unavailable: {e}"
        )

    st.markdown(
        """
        <div style='text-align:center;
                    font-size:20px;
                    color:gray;
                    margin-top:15px;
                    margin-bottom:15px;'>
            ───────── OR ─────────
        </div>
        """,
        unsafe_allow_html=True
    )

    # -----------------------------------
    # MOBILE LOGIN
    # -----------------------------------
    st.subheader("📱 Mobile Login")

    mobile = st.text_input(
        "Mobile Number"
    )

    password = st.text_input(
        "Password",
        type="password"
    )

    if st.button("Login"):

        try:

            user = login_user(
                mobile,
                password
            )

            if user:

                st.session_state.logged_in = True

                st.session_state.username = user["name"]

                st.session_state.user_id = user["id"]

                st.success(
                    "Login Successful!"
                )

                st.switch_page("app.py")

            else:

                st.error(
                    "Invalid Mobile Number or Password"
                )

        except Exception as e:

            st.error(
                f"Error: {e}"
            )

# ===================================
# FORGOT PASSWORD
# ===================================
elif menu == "Forgot Password":

    st.subheader(
        "🔑 Forgot Password"
    )

    mobile = st.text_input(
        "Enter Mobile Number"
    )

    if st.button(
        "Generate OTP"
    ):

        try:

            reset_code = generate_reset_code()

            save_reset_code(
                mobile,
                reset_code
            )

            st.success(
                f"OTP Generated: {reset_code}"
            )

        except Exception as e:

            st.error(
                f"Error: {e}"
            )

    st.markdown("---")

    entered_code = st.text_input(
        "Enter OTP"
    )

    new_password = st.text_input(
        "New Password",
        type="password"
    )

    confirm_password = st.text_input(
        "Confirm New Password",
        type="password"
    )

    if st.button(
        "Reset Password"
    ):

        if new_password != confirm_password:

            st.error(
                "Passwords do not match"
            )

        else:

            try:

                user = verify_reset_code(
                    mobile,
                    entered_code
                )

                if user:

                    reset_password(
                        mobile,
                        new_password
                    )

                    st.success(
                        "Password Reset Successful!"
                    )

                else:

                    st.error(
                        "Invalid OTP"
                    )

            except Exception as e:

                st.error(
                    f"Error: {e}"
                )

# ===================================
# EDIT PROFILE
# ===================================
elif menu == "Edit Profile":

    st.subheader(
        "👤 Edit Profile"
    )

    if not st.session_state.logged_in:

        st.warning(
            "Please login first"
        )

    else:

        name = st.text_input(
            "Full Name"
        )

        mobile = st.text_input(
            "Mobile Number"
        )

        if st.button(
            "Update Profile"
        ):

            try:

                update_profile(
                    st.session_state.user_id,
                    name,
                    mobile
                )

                st.session_state.username = name

                st.success(
                    "Profile Updated Successfully!"
                )

            except Exception as e:

                st.error(
                    f"Error: {e}"
                )

# ===================================
# USER INFO
# ===================================
if st.session_state.logged_in:

    st.markdown("---")

    st.success(
        f"Welcome {st.session_state.username}"
    )

    if st.button("Logout"):

        st.session_state.logged_in = False

        st.session_state.username = ""

        st.session_state.user_id = None

        st.rerun()