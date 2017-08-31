from uuid import UUID
from decimal import *

UUID_GENERATOR = UUID('e59a4b4e-f741-4a48-9c54-ab3e59a91a40')
UUID_PATTERN = '^[0-9A-Fa-f]{8}\-[0-9A-Fa-f]{4}\-[0-9A-Fa-f]{4}\-[0-9A-Fa-f]{4}\-[0-9A-Fa-f]{12}$'
COMMISION_UP = Decimal(1.05)
COMMISION_DOWN = Decimal(0.95)
COUNT = 10