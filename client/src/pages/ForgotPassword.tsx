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
    const dialogRef = useRef<HTMLDialogElement>(null);

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
        try {
            await forgotPassword(email);
            resetError();
            setIsValidUser(true);    
            sessionStorage.setItem('isValidUser', JSON.stringify(true));
            sessionStorage.setItem('userEmail', JSON.stringify(email));
        } 
        catch (error) {
            displayServerError(error, setIsLoading);
        }      
        finally{
            setIsLoading(false);
        }
    }

    const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;

        const verificationCode = (form[0] as HTMLInputElement).value.trim();
        const password = (form[1] as HTMLInputElement).value.trim();
        const email = JSON.stringify(sessionStorage.getItem('userEmail'));
        if (!verificationCode || !password) {
            displayClientError();
            return;
        }
        if (password.length < 6) {
            displayClientError('Password must be at least 6 characters');
            return;
        }
        setIsLoading(true);
        try {
            await resetPassword({ email, password, verificationCode });
            resetError();
            form.reset();
            sessionStorage.removeItem('isValidUser');
            sessionStorage.removeItem('userEmail');
            dialogRef.current?.showModal();
        } 
        catch (error) {
            displayServerError(error);
        }
        finally{
            setIsLoading(false);
        }
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