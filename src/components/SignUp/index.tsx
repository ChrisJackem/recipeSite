import { useState } from "react";
import { useFirebaseService } from "../Firebase/firebaseHook";

const SignUpPage = () => (
  <div>
    <h1>SignUp</h1>
    <SignUpForm />
  </div>
);

export const SignUpForm = () => {
    const firebasService = useFirebaseService();
    const [state, setState] = useState({
        name: '',
        password: ''
    })
    

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const formDataObject = Object.fromEntries(formData.entries()) as {
            name: string;
            password: string;
        };
      
        firebasService.doCreateUserWithEmailAndPassword(formDataObject.name, formDataObject.password)
            .then((userCredentails)=>{
                console.log(userCredentails)
            })
            .catch((error)=>{
                console.error(error.message)
            })
    }

    return (
        <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={state.name || ''}
          onChange={(event) => setState({ ...state, name: event.target.value })}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={state.password || ''}
          onChange={(event) => setState({ ...state, password: event.target.value })}
        />
            
            <button>Submit</button>
        </form>
    )
}

export default SignUpPage