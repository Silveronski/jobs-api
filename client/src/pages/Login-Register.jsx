import { useContext, useState } from "react"
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useErrorHandler } from "../hooks/useErrorHandler";
import FormFields from "../components/FormFields";
import Button from "../components/Button";
import loadingGif from "../assets/images/loadinggif.gif";
import FormContainer from "../components/FormContainer";

const LoginRegister = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const { error, displayClientError, displayServerError, resetError } = useErrorHandler();
    const { register, login } = useContext(AuthContext);
    const navigate = useNavigate();

    const toggleLoginOrRegister = () => {
        setIsLogin(!isLogin); 
        resetError();
    }
        
    const handleLogin = async (e) => {
        e.preventDefault();   
        const user = {
            email: e.target[0].value.trim(),
            password: e.target[1].value.trim()
        } 
        if (!user.email || !user.password) {
            displayClientError();
            return;
        }
        setIsLoading(true);
        const data = await login(user);
        if (data instanceof Error) {
            displayServerError(data, setIsLoading);
            return;
        }
        setIsLoading(false);
        navigate("/dashboard");
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        const user = {
            name: e.target[0].value.trim(),
            email: e.target[1].value.trim(),
            password: e.target[2].value.trim()
        }
        if (!user.email || !user.password || !user.name) {
            displayClientError();
            return;
        }
        if (user.password.length < 6) {
            displayClientError('Password must be at least 6 characters');
            return;
        }         
        setIsLoading(true);
        const data = await register(user);
        if (data instanceof Error) {
            displayServerError(data, setIsLoading);
            return;
        }
        setIsLoading(false);
        const verifyData = { msg: data.msg, email: user.email };
        navigate("/verify-email", { state: {verifyData} });   
    }

    return (
        <FormContainer wrapperClass={isLoading ? "loading" : ""}>
            {isLoading && <img className="loading-indicator" src={loadingGif} alt="loading-gif"/>}
            <h1>{isLogin ? 'Login' : 'Register'}</h1>
            <form onSubmit={isLogin ? handleLogin : handleRegister}>
                {!isLogin && <FormFields label="Name"/>}        
                <FormFields label="Email" inputType="email"/>
                <FormFields label="Password" inputType="password"/>
                <div className="btn-container">
                    {error.activated && <p className="error">{error.msg}</p>}
                    <Button text={isLogin ? "SIGN IN" : "SIGN UP"}/> 
                    {isLogin && <p className="toggler forgot-password"><Link to={"/forgot-password"}>Forgot your password?</Link></p>}                   
                    <p className="toggler">{isLogin ? 'Not a member yet?' : 'Already a member?'}
                        <a onClick={toggleLoginOrRegister}> {isLogin ? 'Register' : 'Login'}</a>
                    </p>
                </div>                  
            </form>
        </FormContainer>                          
    )
}

export default LoginRegister