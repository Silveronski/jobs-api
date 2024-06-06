import React, { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useErrorHandler } from "../hooks/useErrorHandler";
import FormFields from "../components/FormFields";
import Button from "../components/Button";
import check from "../assets/images/check.png";
import loadingGif from "../assets/images/loadinggif.gif";
import FormContainer from "../components/FormContainer";

const ForgotPassword: React.FC = () => {
    const { forgotPassword, resetPassword } = useContext(AuthContext);
    const { error, displayClientError, displayServerError, resetError } = useErrorHandler();
    const [isValidUser, setIsValidUser] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const dialogRef = useRef();

    useEffect(() => {
        const isValidUser = sessionStorage.getItem('isValidUser');
        isValidUser && setIsValidUser(JSON.parse(isValidUser));
    },[]);

    const handleForgotPassword = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const email = (form[0] as HTMLInputElement).value.trim();
        if (!email) {
            displayClientError('Please provide a valid email');
            return;
        }
        setIsLoading(true);
        const data = await forgotPassword(email);
        if (data instanceof Error) {
            displayServerError(data, setIsLoading);
            return;
        }
        resetError();
        setIsValidUser(true);
        setIsLoading(false);
        sessionStorage.setItem('isValidUser', true);
        sessionStorage.setItem('userEmail', JSON.stringify(email));
    }

    const handleResetPassword = async (e) => {
        e.preventDefault();
        const verificationCode = e.target[0].value.trim();
        const newPassword = e.target[1].value.trim();
        const email = JSON.parse(sessionStorage.getItem('userEmail'));
        if (!verificationCode || !newPassword) {
            displayClientError();
            return;
        }
        if (newPassword.length < 6) {
            displayClientError('Please provide a valid password');
            return;
        }
        const data = await resetPassword({ email, newPassword, verificationCode });
        if (data instanceof Error) {
            displayServerError(data);
            return;
        }
        resetError();
        sessionStorage.removeItem('isValidUser');
        sessionStorage.removeItem('userEmail');
        e.target.reset();
        dialogRef.current.showModal();
    }

    return (
        <FormContainer wrapperClass={[isLoading ? "loading" : "", isValidUser ? "" : "no-inline-padding"].join(' ')}>
            {isLoading && <img className="loading-indicator" src={loadingGif} alt="loading-gif"/>}                          
            <h1 className={isValidUser ? "password-reset-title" : "forgot-password-title"}>Reset Password</h1>
            <p className={isValidUser ? "password-reset-success" : "password-reset-prompt"}>
                {isValidUser ? "Success! Please check your email to reset your password."  
                : "Enter your email address and we will send you a code to reset your password."}
            </p>             
            <form onSubmit={!isValidUser ? handleForgotPassword : handleResetPassword} className="forgot-password-form"> 
                {!isValidUser ?         
                    <FormFields label="Email" inputType="email" labelId="forgot-password-email"/>                                                 
                :<>
                    <FormFields label="Verification Code"/>
                    <FormFields label="New Password" inputType="password"/>
                </>}                   
                <div className="btn-container">
                    {error.activated && <p className="error">{error.msg}</p>}
                    <Button text={isValidUser ? "Change Password" : "Send me a reset code"}/> 
                    <p className="toggler back-to-login"><Link to={"/login"}>Back to login</Link></p>                  
                </div>               
            </form>  
            <dialog ref={dialogRef}>
                <img className="dialog-item" src={check} alt="success"/>
                <h2 className="dialog-item">Password Changed!</h2>
                <p className="dialog-item">Your password has been changed successfully</p>
                <Button text="Back to Login" onClick={() => navigate("/login")}/>
            </dialog>      
        </FormContainer>                                                                        
    )
}

export default ForgotPassword