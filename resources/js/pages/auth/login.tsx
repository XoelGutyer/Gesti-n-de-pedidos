import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import PasskeyVerify from '@/components/passkey-verify';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

// Estilos reutilizables (paleta azul)
const labelClase = 'font-medium text-blue-900 dark:text-blue-200';
const inputClase =
    'border-blue-200 focus-visible:border-blue-500 focus-visible:ring-blue-500/30 dark:border-blue-900';
const enlaceClase =
    'text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300';

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Iniciar sesión" />

            <PasskeyVerify />

            {status && (
                <div className="mb-4 rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-center text-sm font-medium text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                    {status}
                </div>
            )}

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email" className={labelClase}>
                                    Correo electrónico
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="correo@ejemplo.com"
                                    className={inputClase}
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label
                                        htmlFor="password"
                                        className={labelClase}
                                    >
                                        Contraseña
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className={`ml-auto text-sm ${enlaceClase}`}
                                            tabIndex={5}
                                        >
                                            ¿Olvidaste tu contraseña?
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Contraseña"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                />
                                <Label
                                    htmlFor="remember"
                                    className="text-slate-600 dark:text-slate-300"
                                >
                                    Recordarme
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full bg-blue-600 text-white shadow-md shadow-blue-600/25 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Iniciar sesión
                            </Button>
                        </div>

                        <div className="text-center text-sm text-slate-500 dark:text-slate-400">
                            ¿No tenés una cuenta?{' '}
                            <TextLink
                                href={register()}
                                tabIndex={5}
                                className={enlaceClase}
                            >
                                Registrate
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Login.layout = {
    title: 'Iniciá sesión en tu cuenta',
    description: 'Ingresá tu correo y contraseña para continuar',
};