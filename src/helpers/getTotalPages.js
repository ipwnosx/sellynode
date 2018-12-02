const getTotalPages = response => {
  const totalPages = parseInt(response.headers["x-total-pages"])
  return totalPages
}

module.exports = getTotalPages
