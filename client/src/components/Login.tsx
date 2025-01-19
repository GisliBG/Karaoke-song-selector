import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Input } from "./ui/Input";

export const Login = () => {
  const auth = useAuth();
  const [password, setPassword] = useState("");
  return (
    <div className='flex h-full w-full justify-center items-center'>
      <Input
        type='password'
        placeholder='Enter your admin password'
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        onKeyDown={async (event) => {
          if (event.key === "Enter") {
            try {
              await auth.login(password, () => {
                setPassword("");
              });
            } catch (error) {
              console.log(error);
            }
          }
        }}
      />
    </div>
  );
};
