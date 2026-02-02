package handlers

import (
	"encoding/json"
	"net/http"
	"time"
)

type ConvertRequest struct {
	Time         string `json:"time"`
	FromTimezone string `json:"fromTimezone"`
	ToTimezone   string `json:"toTimezone"`
}

type ConvertResponse struct {
	OriginalTime  string `json:"originalTime"`
	ConvertedTime string `json:"convertedTime"`
	FromTimezone  string `json:"fromTimezone"`
	ToTimezone    string `json:"toTimezone"`
}

type BatchConvertRequest struct {
	Time         string   `json:"time"`
	FromTimezone string   `json:"fromTimezone"`
	ToTimezones  []string `json:"toTimezones"`
}

type BatchConvertResponse struct {
	OriginalTime string            `json:"originalTime"`
	FromTimezone string            `json:"fromTimezone"`
	Conversions  map[string]string `json:"conversions"`
}

// ConvertTimezone converts a time from one timezone to another
func ConvertTimezone(w http.ResponseWriter, r *http.Request) {
	var req ConvertRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"Invalid request body"}`, http.StatusBadRequest)
		return
	}

	// Load source timezone
	fromLoc, err := time.LoadLocation(req.FromTimezone)
	if err != nil {
		http.Error(w, `{"error":"Invalid source timezone"}`, http.StatusBadRequest)
		return
	}

	// Parse the time
	t, err := time.ParseInLocation(time.RFC3339, req.Time, fromLoc)
	if err != nil {
		// try other formats
		t, err = time.ParseInLocation("2006-01-02T15:04:05", req.Time, fromLoc)
		if err != nil {
			http.Error(w, `{"error":"Invalid time format. Use RFC3339"}`, http.StatusBadRequest)
			return
		}
	}

	// Load target timezone
	toLoc, err := time.LoadLocation(req.ToTimezone)
	if err != nil {
		http.Error(w, `{"error":"Invalid target timezone"}`, http.StatusBadRequest)
		return
	}

	// Convert
	convertedTime := t.In(toLoc)

	resp := ConvertResponse{
		OriginalTime:  t.Format(time.RFC3339),
		ConvertedTime: convertedTime.Format(time.RFC3339),
		FromTimezone:  req.FromTimezone,
		ToTimezone:    req.ToTimezone,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

// BatchConvertTimezone converts a time to multiple timezones at once
func BatchConvertTimezone(w http.ResponseWriter, r *http.Request) {
	var req BatchConvertRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"Invalid request body"}`, http.StatusBadRequest)
		return
	}

	// Load source timezone
	fromLoc, err := time.LoadLocation(req.FromTimezone)
	if err != nil {
		http.Error(w, `{"error":"Invalid source timezone"}`, http.StatusBadRequest)
		return
	}

	// Parse the time
	t, err := time.ParseInLocation(time.RFC3339, req.Time, fromLoc)
	if err != nil {
		t, err = time.ParseInLocation("2006-01-02T15:04:05", req.Time, fromLoc)
		if err != nil {
			http.Error(w, `{"error":"Invalid time format"}`, http.StatusBadRequest)
			return
		}
	}

	// Convert to each timezone
	conversions := make(map[string]string)
	for _, tz := range req.ToTimezones {
		toLoc, err := time.LoadLocation(tz)
		if err != nil {
			conversions[tz] = "invalid timezone"
			continue
		}
		conversions[tz] = t.In(toLoc).Format(time.RFC3339)
	}

	resp := BatchConvertResponse{
		OriginalTime: t.Format(time.RFC3339),
		FromTimezone: req.FromTimezone,
		Conversions:  conversions,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

// ListTimezones returns a list of common timezones
func ListTimezones(w http.ResponseWriter, r *http.Request) {
	// common timezones people actually use
	timezones := []map[string]string{
		{"id": "UTC", "name": "UTC", "offset": "+00:00"},
		{"id": "America/New_York", "name": "Eastern Time", "offset": "-05:00"},
		{"id": "America/Chicago", "name": "Central Time", "offset": "-06:00"},
		{"id": "America/Denver", "name": "Mountain Time", "offset": "-07:00"},
		{"id": "America/Los_Angeles", "name": "Pacific Time", "offset": "-08:00"},
		{"id": "America/Sao_Paulo", "name": "Brasilia Time", "offset": "-03:00"},
		{"id": "Europe/London", "name": "London", "offset": "+00:00"},
		{"id": "Europe/Paris", "name": "Central European", "offset": "+01:00"},
		{"id": "Europe/Berlin", "name": "Berlin", "offset": "+01:00"},
		{"id": "Europe/Moscow", "name": "Moscow", "offset": "+03:00"},
		{"id": "Asia/Dubai", "name": "Dubai", "offset": "+04:00"},
		{"id": "Asia/Kolkata", "name": "India", "offset": "+05:30"},
		{"id": "Asia/Singapore", "name": "Singapore", "offset": "+08:00"},
		{"id": "Asia/Tokyo", "name": "Japan", "offset": "+09:00"},
		{"id": "Asia/Seoul", "name": "Korea", "offset": "+09:00"},
		{"id": "Australia/Sydney", "name": "Sydney", "offset": "+11:00"},
		{"id": "Pacific/Auckland", "name": "New Zealand", "offset": "+13:00"},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"timezones": timezones,
	})
}
