package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"product-api/internal/db"
	"product-api/internal/models"
	"product-api/internal/resources"
	"product-api/internal/validators"
)

func GetProducts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	rows, err := db.DB.Query("SELECT id, name, price FROM products")
	if err != nil {
		http.Error(w, "DB query error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var products []models.Product
	for rows.Next() {
		var p models.Product
		if err := rows.Scan(&p.ID, &p.Name, &p.Price); err != nil {
			http.Error(w, "DB scan error", http.StatusInternalServerError)
			return
		}
		products = append(products, p)
	}

	json.NewEncoder(w).Encode(products)
}
func CreateProduct(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var p models.Product
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if err := validators.ValidateProduct(p.Name, p.Price); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	result, err := db.DB.Exec("INSERT INTO products (name, price) VALUES (?, ?)", p.Name, p.Price)
	if err != nil {
		http.Error(w, "DB insert error", http.StatusInternalServerError)
		return
	}

	id, _ := result.LastInsertId()
	p.ID = int(id)

	json.NewEncoder(w).Encode(resources.ProductResponse(p))
}
func UpdateProduct(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var p models.Product
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if p.ID <= 0 {
		http.Error(w, "Invalid product ID", http.StatusBadRequest)
		return
	}

	if err := validators.ValidateProduct(p.Name, p.Price); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	_, err := db.DB.Exec("UPDATE products SET name=?, price=? WHERE id=?", p.Name, p.Price, p.ID)
	if err != nil {
		http.Error(w, "DB update error", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(resources.ProductResponse(p))
}

func DeleteProduct(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	idStr := r.URL.Query().Get("id")
	if idStr == "" {
		http.Error(w, "Missing product ID", http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		http.Error(w, "Invalid product ID", http.StatusBadRequest)
		return
	}

	_, err = db.DB.Exec("DELETE FROM products WHERE id=?", id)
	if err != nil {
		http.Error(w, "DB delete error", http.StatusInternalServerError)
		return
	}

	w.Write([]byte("Product deleted successfully"))
}
