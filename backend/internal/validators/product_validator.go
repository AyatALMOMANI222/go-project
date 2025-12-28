package validators
import "fmt"
import "strings"

func ValidateProduct(name string, price int) error {
	if strings.TrimSpace(name) == "" {
		return fmt.Errorf("name cannot be empty")
	}
	if price <= 0 {
		return fmt.Errorf("price must be greater than 0")
	}
	return nil
}
