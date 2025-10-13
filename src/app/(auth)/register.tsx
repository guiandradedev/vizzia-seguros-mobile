import { CreateAccountProvider } from '@/contexts/CreateAccountContext';
import RegisterPage from '@/pages/auth/Register';


export default function RegisterScreen() {
    return (
      <CreateAccountProvider>
        <RegisterPage />
      </CreateAccountProvider>
    );
}