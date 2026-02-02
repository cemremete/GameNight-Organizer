package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"timezone-service/internal/handlers"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}

	r := mux.NewRouter()

	// Health check
	r.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"ok"}`))
	}).Methods("GET")

	// Timezone endpoints
	r.HandleFunc("/convert", handlers.ConvertTimezone).Methods("POST")
	r.HandleFunc("/batch-convert", handlers.BatchConvertTimezone).Methods("POST")
	r.HandleFunc("/timezones", handlers.ListTimezones).Methods("GET")

	// CORS middleware
	handler := corsMiddleware(r)

	log.Printf("🌍 Timezone service running on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
