import styled from "@emotion/styled";
import { ChangeEvent, FormEvent, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { RouterProps, Link } from "react-router-dom";
import { GENERICS } from "../components/GlobalStyles";
import { Wrapper } from "../components/Wrapper";
import { useSignupMutation } from "../generated/graphql";
import { useRequired } from "../helper/hooks";

type FormData = {
  email: string;
  password: string;
}


export function Signup({history}: RouterProps) {
  // const [form, setForm] = useState({
  //   email: "",
  //   password: ""
  // })

  const [submitSignup, {error, loading}] = useSignupMutation();
  // const {isValid} = useRequired(form);

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<FormData>()

  const onSubmitHandler:SubmitHandler<FormData> = async (data: FormData) => {
    // evt.preventDefault();
    try {
      await submitSignup({
        variables: data,
      });
      history.push("/login");
    } catch (error) {
      console.error(error)
    }
  };

  // const onChangeHandler = (name: string) => ({target}:ChangeEvent<HTMLInputElement>) => setForm({...form, [name]: target.value})

  return (
    <Wrapper center={true}>
      <FormWrapper className="login-container">
        <div className="left-side">
          <img src="https://businesstemplates.co.nz/wp-content/uploads/2020/12/login-concept-illustration_114360-739.jpg" alt="login"/>
        </div>
        <div className="right-side">
          <div>
            <img src="https://www.freeiconspng.com/uploads/evernote-icon-2.png" alt=""/>
            <h2>Nevernote</h2>
          </div>
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <div>
              <input placeholder="Email" /*value={form.email} onChange={onChangeHandler("email")}*/ {...register("email", {
                  required: "Email is required"
              })}
              />
              {errors.email && <p className="text-error">{errors.email.message}</p>}
            </div>

            <div>
              <input type="password" placeholder="Password" /*value={form.password} onChange={onChangeHandler("password")}*/ 
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password should be at least 6 characters"
                }
            })}
              />
              {errors.password && <p className="text-error">{errors.password.message}</p>}
            </div>

            {error && error.graphQLErrors.map(({message}, i) => 
              <div key={i}>
                <small className="error-message">{message}</small>
              </div>
              )
            }

            <div>
              <button disabled={isSubmitting || loading} type="submit">{loading ? "..." : "Submit"}</button>
            </div>
            <p>
              Already have an account? Log In&nbsp;
              <span>
                <Link to="/login">here</Link>
              </span> 
            </p>
          </form>
          
        </div>
      </FormWrapper>
    </Wrapper>
  )
}

const FormWrapper = styled("div")`
  display: flex;
  align-items: center;
  border: ${GENERICS.border};
  border-radius: 5px;
  padding: 50px;
  user-select: none;
  gap: 20px;
  >div {
    flex: 0.5;
  }

  .left-side {
    img {
      width: 200px;
    }
  }

  .right-side {
    >div:first-of-type {
      text-align: center;
      img {
        width: 50px;
        border-radius: 10px;
      }
      margin-bottom: 20px;
    }

    form {
      .text-error {
        padding: 5px 0;
        color: red;
      }
      div {
        margin-bottom: 10px;

        input {
          border: 2px solid gray;
          border-radius: 5px;
          padding: 10px 20px;
          outline: none;
          transition: 0.5s;

          &:focus {
            border-color: blue;
          }
        }

        button {
          border-radius: 5px;
          width: 100%;
          color: white;
          background-color: ${GENERICS.primaryColor};
          padding: 8px 20px;

          &:disabled {
            background-color: #ccc;
          }

        }

        small.error-message{
          color: red;
        }
      }

      p {
        font-size: 12px;
        a {
          color: ${GENERICS.primaryColor};
        }
      }
    }
  }
`;

