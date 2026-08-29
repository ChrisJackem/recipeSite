import { useState } from "react";
import { useFirebaseService } from "../Firebase/firebaseHook";
import { EMAIL_PATTERN, PASSWORD_PATTERN } from "../../_constants/patterns";
import { toast } from "react-toastify";
import { FIX_ERRORS } from "../../_constants/strings";

const MIN_LENGTH_NAME:number = 3;
const MIN_LENGTH_PASS:number = 8;

type FormState = {
    name: string;
    email: string;
    password: string;
};
type FormErrors = Partial<Record<keyof FormState, string[]>>;

const SignUpPage = () => (
  <div>
    <h1>SignUp</h1>
    <SignUpForm />
  </div>
);

export const SignUpForm = () => {
    const firebasService = useFirebaseService();
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
    const [formState, setFormState] = useState<FormState>({
        name: '',
        email: '',
        password: ''
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormState((currentState) => {
            const nextState = { ...currentState, [name]: value };            
            return { ...nextState };
        }); 
    };

    const validateForm = (state: FormState = formState) => {
        const nameErrors = state.name.length >= MIN_LENGTH_NAME
            ? undefined
            : [`Name must be at least ${MIN_LENGTH_NAME} characters long.`];

        const emailErrors = EMAIL_PATTERN.test(state.email)
            ? undefined
            : ["Enter a valid email address."];

        const password_length_valid = state.password.length >= MIN_LENGTH_PASS;
        const password_pattern_valid = PASSWORD_PATTERN.test(state.password);
        const passwordErrors = password_length_valid && password_pattern_valid
            ? undefined
            : [
                ...(password_length_valid ? [] : [`Password must be at least ${MIN_LENGTH_PASS} characters long.`]),
                ...(password_pattern_valid ? [] : ["Password must include an uppercase letter, a number, and at least one special character."]),
            ];

        setFormErrors({ name: nameErrors, email: emailErrors, password: passwordErrors });
        return [nameErrors, emailErrors, passwordErrors].every(v => v == undefined);
    };

    // Error display helper
    const createErrorList = (errors: string[] | undefined) =>
        errors?.map( (error, i) => (
            <div key={i}>{error}</div>
        ));

    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        toast.dismiss();
        //const allUndefined = Object.values(formErrors).every(value => value === undefined);
        const toastId = toast.loading( 'Creating User...' );        
        try{
            if ( !validateForm() ) throw new Error(FIX_ERRORS);
            console.log(formErrors)         
            const msg = await firebasService.doCreateUserWithEmailAndPassword(formState.name, formState.email, formState.password);
            toast.update(toastId, {
                render: msg,
                type: 'success',
                isLoading: false,
                position: 'bottom-left',
            });
            setFormSubmitted(true);
        }catch(error: unknown){
            toast.update(toastId, {
                render: error instanceof Error ? error.message : String(error),
                type: 'error',
                isLoading: false,
                position: 'bottom-left',
            });
        }              
    }

    return (
        <form onSubmit={handleSubmit} >
            <fieldset disabled={formSubmitted}>

                <div>
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Name"
                        required
                        value={formState.name || ''}
                        onChange={handleChange}
                    />
                    { createErrorList(formErrors.name) }
                </div>

                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        placeholder="Email"
                        autoComplete="email"
                        required
                        value={formState.email || ''}
                        onChange={handleChange}
                    />
                    { createErrorList(formErrors.email) }
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Password"
                        required
                        value={formState.password || ''}
                        onChange={handleChange}
                    />
                    { createErrorList(formErrors.password) }
                </div>
                
                <button type="submit">Submit</button>
            </fieldset>
        </form>
    )
}

export default SignUpPage