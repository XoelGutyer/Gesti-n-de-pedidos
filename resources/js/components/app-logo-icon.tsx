type Props = {
    className?: string;
};

export default function AppLogoIcon({ className }: Props) {
    return (
        <img
            src="/images/logo.png"
            alt="Logo"
            className={className}
        />
    );
}