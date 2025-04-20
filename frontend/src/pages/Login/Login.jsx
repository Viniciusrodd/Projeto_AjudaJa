
// css
import styles from './Login.module.css';

// components
import NavBar from '../../components/NavBar/NavBar';

const Login = () => {
    return (
        <div className='app_register_login'>
            <NavBar condition={ true } />
            <h1>Login</h1>
        </div>
    );
};

export default Login;
