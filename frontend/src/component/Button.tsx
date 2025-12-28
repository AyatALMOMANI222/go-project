type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ className = "", ...props }: ButtonProps) => {
    return (
        <button
            {...props}
            className={`px-4 py-2 rounded text-white transition ${className}`}
        />
    );
};

export default Button;
