import React from "react"
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Button,
} from "@mui/material"
import { Search as SearchIcon, Refresh as RefreshIcon } from "@mui/icons-material"
import { User } from "../types/fileTypes"

interface FileFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedUserId: string
  setSelectedUserId: (userId: string) => void
  users: User[]
  onRefresh: () => void
}

const FileFilters: React.FC<FileFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedUserId,
  setSelectedUserId,
  users,
  onRefresh,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="חיפוש קבצים"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton onClick={() => setSearchTerm("")} edge="end" size="small">
                    ×
                  </IconButton>
                </InputAdornment>
              ),
            }}
            dir="rtl"
            size="small"
          />
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth size="small">
            <InputLabel id="user-filter-label" sx={{ right: 14, left: "auto" }}>
              סנן לפי משתמש
            </InputLabel>
            <Select
              labelId="user-filter-label"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value as string)}
              label="סנן לפי משתמש"
              sx={{ textAlign: "right" }}
            >
              <MenuItem value="all">כל המשתמשים</MenuItem>
              {users.map((user) => (
                <MenuItem key={user.id || "unknown"} value={user.id || ""}>
                  {user.name || "משתמש לא ידוע"}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button 
              variant="outlined" 
              startIcon={<RefreshIcon />} 
              onClick={onRefresh}
              size="small"
            >
              רענן רשימה
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default FileFilters