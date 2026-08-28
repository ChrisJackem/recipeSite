import React, { useState } from 'react'
import { useFirebaseService } from '../Firebase/firebaseHook';
import { EMAIL_PATTERN, PASSWORD_PATTERN } from '../../_constants/patterns';

interface SignInFormState {
    email: string;
    password: string;
    valid: boolean;
}

const SignInPage = () => {
  return (
    <main>
      <h1>Sign in</h1>
      <SignUpForm />
    </main>
  )
}

export const SignUpForm = ()=>{
    const firebasService = useFirebaseService();
    const [formState, setFormState] = useState<SignInFormState>({
        email: '',
        password: '',
        valid: false
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormState((currentState) => {
            const nextState = { ...currentState, [name]: value };            
            return {
                ...nextState, 
                valid: EMAIL_PATTERN.test(formState.email) && PASSWORD_PATTERN.test(formState.password)
            };
        });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!formState.valid) return;
        try {
            await firebasService.doSignInWithEmailAndPassword( formState.email, formState.password );
        } catch (error) {
            console.error(error);
        }
    }


    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    onChange={handleChange}
                />
            </div>
            <button type="submit" disabled={!formState.valid}>Sign in</button>
        </form>
    )
}

export default SignInPage