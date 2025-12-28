package routes

import (
	"net/http"

	"product-api/internal/handlers"
	"product-api/internal/middleware"
)

func SetupRoutes() *http.ServeMux {
	mux := http.NewServeMux()

	// Health check
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("API is running"))
	})
	mux.HandleFunc("/register", handlers.Register)
	mux.HandleFunc("/login", handlers.Login)

	mux.HandleFunc("/products", handlers.GetProducts) // GET
	mux.Handle("/products/create", middleware.AuthMiddleware(http.HandlerFunc(handlers.CreateProduct)))
	mux.Handle("/products/update", middleware.AuthMiddleware(http.HandlerFunc(handlers.UpdateProduct)))
	mux.Handle("/products/delete", middleware.AuthMiddleware(http.HandlerFunc(handlers.DeleteProduct)))

	return mux
}
