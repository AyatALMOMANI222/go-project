package resources

import "product-api/internal/models"

func ProductResponse(p models.Product) map[string]interface{} {
	return map[string]interface{}{
		"id":    p.ID,
		"name":  p.Name,
		"price": p.Price,
	}
}
