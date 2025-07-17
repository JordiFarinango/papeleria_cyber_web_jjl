from django import template

register = template.Library()

@register.filter
def decimal_point(value):
    """
    Convierte un número (Decimal, float, etc.) a una cadena con punto decimal.
    Ejemplo: 1.25 -> "1.25", 1,25 -> "1.25"
    """
    return str(value).replace(',', '.')