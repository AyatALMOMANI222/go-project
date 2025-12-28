import { useState } from "react";
import Button from "../Button";
import Input from "../InputField"
type Props = {
    onSubmit: (name: string, price: number) => void;
};

const ProductForm = ({ onSubmit }: Props) => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState<number | "">("");

    const handleSubmit = () => {
        if (!name || price === "") return;
        onSubmit(name, Number(price));
        setName("");
        setPrice("");
    };

    return (
        <div className="flex gap-2 mb-6">
            <Input
                placeholder="Product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <Input

                placeholder="Price"
                className="w-32"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
            />
            <Button
                className="bg-blue-500 hover:bg-blue-600"
                onClick={handleSubmit}
            >
                Add
            </Button>
        </div>
    );
};

export default ProductForm;
