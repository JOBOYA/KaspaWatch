import { Button } from "@/components/ui/button";

interface ButtonSecondaryProps {
    children: React.ReactNode;
    onClick: () => void;
    }


const ButtonSecondary = ({ children, onClick }: ButtonSecondaryProps) => {
  return <Button variant="secondary" onClick={onClick}>{children}</Button>
}

export default ButtonSecondary;
