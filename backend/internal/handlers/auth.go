package handlers

import (
	"encoding/json"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"

	"product-api/internal/db"
	"product-api/internal/models"
)

type AuthRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type AuthResponse struct {
	Token   string `json:"token,omitempty"`
	Message string `json:"message,omitempty"`
}

func Register(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req AuthRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	var exists int
	err := db.DB.QueryRow("SELECT COUNT(*) FROM users WHERE username=?", req.Username).Scan(&exists)
	if err != nil {
		http.Error(w, "DB error", http.StatusInternalServerError)
		return
	}
	if exists > 0 {
		http.Error(w, "Username already exists", http.StatusBadRequest)
		return
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)

	_, err = db.DB.Exec("INSERT INTO users (username, password) VALUES (?, ?)", req.Username, string(hashedPassword))
	if err != nil {
		http.Error(w, "DB insert error", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(AuthResponse{Message: "User registered successfully"})
}

func Login(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req AuthRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	var user models.User
	err := db.DB.QueryRow(
		"SELECT id, password FROM users WHERE username=?",
		req.Username,
	).Scan(&user.ID, &user.Password)

	if err != nil {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}

	if err := bcrypt.CompareHashAndPassword(
		[]byte(user.Password),
		[]byte(req.Password),
	); err != nil {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}

	claims := jwt.MapClaims{
		"user_id":  user.ID,
		"username": req.Username,
		"exp":      time.Now().Add(24 * time.Hour).Unix(),
	}

	jwtKey := []byte(os.Getenv("JWT_SECRET"))

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		http.Error(w, "Could not create token", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(AuthResponse{Token: tokenString})
}
