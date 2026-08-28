import { useState } from "react";
import { useFirebaseService } from "../Firebase/firebaseHook";
import { EMAIL_PATTERN, PASSWORD_PATTERN } from "../../_constants/patterns";
import { toast } from "react-toastify";

// const
const MIN_LENGTH_NAME:number = 3;
const MIN_LENGTH_PASS:number = 8;


// types
type FormState = {
    name: string;
    email: string;
    password: string;
};
type FormValid = Partial<Record<keyof FormState, string[]>> & { 
    formIsValid: boolean,
    userValid: boolean,
    userError: undefined | string
};

const SignUpPage = () => (
  <div>
    <h1>SignUp</h1>
    <SignUpForm />
  </div>
);

export const SignUpForm = () => {
    const firebasService = useFirebaseService();
    const [formState, setFormState] = useState<FormState>({
        name: '',
        email: '',
        password: ''
    });
    const [ formValid, setFormValid ] = useState<FormValid>({ 
        formIsValid: false, 
        userValid: false, 
        userError: undefined
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormState((currentState) => {
            const nextState = { ...currentState, [name]: value };            
            return { ...nextState };
        });
        validate();   
    };

    const validate = () => {
        const name_valid = formState.name.length >= MIN_LENGTH_NAME;
        const email_valid = EMAIL_PATTERN.test(formState.email);
        const password_length_valid = formState.password.length >= MIN_LENGTH_PASS;
        const password_pattern_valid = PASSWORD_PATTERN.test(formState.password);
        const password_valid = password_length_valid && password_pattern_valid;
        const form_valid = name_valid && email_valid && password_valid;

        setFormValid({
            ...formValid,
            name: name_valid ? [] : [`Name must be at least ${MIN_LENGTH_NAME} characters long.`],
            email: email_valid ? [] : ["Enter a valid email address."],
            password: [
                ...(password_length_valid ? [] : [`Password must be at least ${MIN_LENGTH_PASS} characters long.`]),
                ...(password_pattern_valid ? [] : ["Password must include an uppercase letter, a number, and at least one special character."]),
            ],
            formIsValid: form_valid
        });
        return form_valid
    };

    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        const toastId = toast.loading('Creating User...', {
            closeButton: true
        });

        console.log("SUB")
        if ( formValid.formIsValid ){
            try{
                //await firebasService.doCreateUserWithEmailAndPassword(formState.name, formState.email, formState.password);
                const msg = await firebasService.doCreateUserWithEmailAndPassword(formState.name, formState.email, formState.password);
                
                toast.update(toastId, {
                    render: msg,
                    type: 'success',
                    isLoading: false,
                    position: 'bottom-left',
                });
                //console.log(msg)
                setFormValid({ ...formValid, userValid: true})
            }catch(error: unknown){
                toast.update(toastId, {
                    render: error instanceof Error ? error.message : String(error),
                    type: 'error',
                    isLoading: false,
                    position: 'bottom-left',
                });
                console.error(error)
            }         
        }        
    }

    return (
        <form onSubmit={handleSubmit} >
            <fieldset disabled={formValid.userValid}>

                <div className="flex">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Name"
                        value={formState.name || ''}
                        onChange={handleChange}
                    />
                </div>

                <div className="flex">
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        placeholder="Email"
                        autoComplete="email"
                        value={formState.email || ''}
                        onChange={handleChange}
                    />
                </div>

                <div className="flex">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Password"
                        value={formState.password || ''}
                        onChange={handleChange}
                    />
                </div>
                
                <button type="submit" disabled={!formValid.formIsValid}>Submit</button>
            </fieldset>
        </form>
    )
}

export default SignUpPage
