import React, { useEffect } from "react";
import { doSignInWithEmailAndPassword, doCreateUserWithEmailAndPassword } from "../../firebase/auth";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm, type SubmitHandler } from "react-hook-form";
import css from './Modal.module.css'

type AuthMode = 'login' | 'register';

interface ModalProps {
    mode: AuthMode;
    onClose: () => void;
}

type FormData = {
    name?: string
    email: string
    password: string
}

const loginSchema = yup.object({
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
})

const registerSchema = yup.object({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
})

export const Modal = ({ mode, onClose }: ModalProps) => {
    const navigate = useNavigate()
    const schema = mode === 'login' ? loginSchema : registerSchema;

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
        resolver: yupResolver(schema)
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onSubmit: SubmitHandler<FormData> = async ({ name, email, password }) => {
        try {
            if (mode === 'login') {
                await doSignInWithEmailAndPassword(email, password);
            } else {
                await doCreateUserWithEmailAndPassword(name ?? '', email, password);
            }
            reset();
            onClose();
            navigate('/psychologists');
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            alert(message);
        }
    };

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [onClose]);

    const handleBackDropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }

    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, []);

    return (
        <div className={css.backdrop} onClick={handleBackDropClick}>
            <div className={css.modal}>
                <button type="button" className={css.close_btn} onClick={onClose} aria-label="Close">x</button>
                <h2 className={css.title}>
                    {mode === 'login' ? "Log In" : "Register"}
                </h2>
                <p className={css.text}>
                    {mode === 'login' ? "Welcome back! Please enter your credentials to access your account and continue your search for a psychologist." : "Thank you for your interest in our platform! In order to register, we need some information. Please provide us with the following information."}
                </p>
                <form className={css.form} onSubmit={handleSubmit(onSubmit)}>
                    {mode === 'register' && (
                        <div className={css.field}>
                            <label className={css.label} htmlFor="name">Name</label>
                            <input className={css.input} id="name" type="text" {...register('name')} />
                            {errors.name && <p className={css.error}>{errors.name.message}</p>}
                        </div>
                    )}
                    <div className={css.field}>
                        <label htmlFor="email" className={css.label}>Email</label>
                        <input className={css.input} type="text" id="email" {...register("email")}/>
                        {errors.email && <p className={css.error}>{errors.email.message}</p>}
                    </div>
                    <div className={css.field}>
                        <label htmlFor="password" className={css.label}>Password</label>
                        <input type="text" className={css.input} {...register("password")}/>
                        {errors.password && <p className={css.error}>{errors.password.message}</p>}
                    </div>

                    <button type="submit" className={css.submit_btn} disabled={isSubmitting}>
                        {isSubmitting ? "Please wait..." : mode === 'login' ? "Log In" : "Sign Up"}
                    </button>
                </form>
            </div>
        </div>
    )
}