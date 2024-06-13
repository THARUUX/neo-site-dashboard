import Layout from "@/components/Layout";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import ProductForm from "@/components/ProductForm";

export default function NewProduct() {
    return (
        <Layout>
            <div className="w-full h-full p-5 text-lime-900">
                <h1 className="text-xl">New Product</h1>
                <ProductForm />
            </div>
        </Layout>
    );
}
