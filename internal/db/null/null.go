package null

import (
	"database/sql"
)

type String struct {
	sql.NullString
}

func NewString(s string, valid bool) String {
	return String{
		NullString: sql.NullString{
			String: s,
			Valid:  valid,
		},
	}
}

func WrapString(s string) String {
	return NewString(s, s != "")
}
