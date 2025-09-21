package null

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestWrapString(t *testing.T) {
	var s String

	s = WrapString("test")
	assert.Equal(t, "test", s.String)
	assert.Equal(t, true, s.Valid)

	s = WrapString("")
	assert.Equal(t, "", s.String)
	assert.Equal(t, false, s.Valid)
}
