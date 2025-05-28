import React from "react"
import {
  Box,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination as MuiPagination,
} from "@mui/material"
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  FirstPage,
  LastPage,
} from "@mui/icons-material"

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  onItemsPerPageChange: (itemsPerPage: number) => void
}

const PaginationComponent: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const handleFirstPage = () => onPageChange(1)
  const handleLastPage = () => onPageChange(totalPages)
  const handlePrevPage = () => onPageChange(Math.max(1, currentPage - 1))
  const handleNextPage = () => onPageChange(Math.min(totalPages, currentPage + 1))

  if (totalItems === 0) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          לא נמצאו קבצים
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: 2,
        borderTop: 1,
        borderColor: "divider",
        mt: 2,
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      {/* Items per page selector */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>פריטים בעמוד</InputLabel>
          <Select
            value={itemsPerPage}
            label="פריטים בעמוד"
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </FormControl>
        
        <Typography variant="body2" color="text.secondary">
          מציג {startItem}-{endItem} מתוך {totalItems} קבצים
        </Typography>
      </Box>

      {/* Pagination controls */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {/* First page button */}
        <Button
          size="small"
          onClick={handleFirstPage}
          disabled={currentPage === 1}
          startIcon={<FirstPage />}
          sx={{ minWidth: "auto", px: 1 }}
        >
          ראשון
        </Button>

        {/* Previous page button */}
        <Button
          size="small"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          startIcon={<KeyboardArrowLeft />}
          sx={{ minWidth: "auto", px: 1 }}
        >
          קודם
        </Button>

        {/* MUI Pagination component */}
        <MuiPagination
          count={totalPages}
          page={currentPage}
          onChange={(_, page) => onPageChange(page)}
          color="primary"
          shape="rounded"
          showFirstButton={false}
          showLastButton={false}
          siblingCount={1}
          boundaryCount={1}
          size="small"
        />

        {/* Next page button */}
        <Button
          size="small"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          endIcon={<KeyboardArrowRight />}
          sx={{ minWidth: "auto", px: 1 }}
        >
          הבא
        </Button>

        {/* Last page button */}
        <Button
          size="small"
          onClick={handleLastPage}
          disabled={currentPage === totalPages}
          endIcon={<LastPage />}
          sx={{ minWidth: "auto", px: 1 }}
        >
          אחרון
        </Button>
      </Box>

      {/* Page info for mobile */}
      <Box sx={{ display: { xs: "block", md: "none" }, width: "100%" }}>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          עמוד {currentPage} מתוך {totalPages}
        </Typography>
      </Box>
    </Box>
  )
}

export default PaginationComponent