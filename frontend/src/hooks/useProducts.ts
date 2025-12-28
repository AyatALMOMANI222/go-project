import { useEffect, useState } from "react";
import api from "../services/api";

export type Product = {
    id: number;
    name: string;
    price: number;
};

export const useProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await api.get<Product[]>("/products");
            setProducts(res.data);
        } catch {
            setError("Failed to fetch products");
        } finally {
            setLoading(false);
        }
    };

    const createProduct = async (product: Product) => {
        await api.post("/products/create", product);
        fetchProducts();
    };

    const updateProduct = async (product: Product) => {
        await api.put("/products/update", product);
        fetchProducts();
    };

    const deleteProduct = async (id: number) => {
        await api.delete(`/products/delete?id=${id}`);
        fetchProducts();
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return {
        products,
        loading,
        error,
        createProduct,
        updateProduct,
        deleteProduct,
    };
};
