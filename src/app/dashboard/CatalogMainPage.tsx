"use client";
import { useEffect, useState } from "react";
import { Box, Typography, Chip, CircularProgress, Tooltip, IconButton } from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";
import CloseIcon from "@mui/icons-material/Close";
import { getCatalogCategories, getCatalogSections } from "@/src/services/authService/authService";


interface CatalogSection {
  id: number;
  name: string;
  imageUrl: string;
  isActive: boolean;
}

interface CatalogCategory {
  id: number;
  name: string;
  slug: string;
  isActive: boolean;
  sectionId: number;
}

export default function CatalogMainPage() {
  const [sections, setSections] = useState<CatalogSection[]>([]);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [selectedSection, setSelectedSection] = useState<CatalogSection | null>(null);
  const [catLoading, setCatLoading] = useState(false);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    setLoading(true);
    try {
      const res = await getCatalogSections();
      if (res) setSections(res);
    } catch (err) {
      console.error("Error fetching catalog sections", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async (sectionId: number) => {
    setCatLoading(true);
    try {
      const res = await getCatalogCategories(sectionId);
      if (res) setCategories(res);
    } catch (err) {
      console.error("Error fetching categories", err);
    } finally {
      setCatLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <CategoryIcon color="primary" />
        <Typography variant="h5" fontWeight={600}>Catalog Sections</Typography>
      </Box>

      {/* Sections Grid */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 3 }}>
        {sections.length === 0 ? (
          <Typography color="text.secondary">No sections found.</Typography>
        ) : (
          sections.map((section) => (
            <Box
              key={section.id}
              onClick={() => { setSelectedSection(section); fetchCategories(section.id); }}
              sx={{
                background: "#fff",
                borderRadius: 3,
                border: selectedSection?.id === section.id ? "2px solid #667eea" : "1px solid #e2e8f0",
                boxShadow: selectedSection?.id === section.id ? "0 6px 20px rgba(102,126,234,0.2)" : "0 2px 8px rgba(0,0,0,0.06)",
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": { boxShadow: "0 6px 20px rgba(0,0,0,0.1)" },
              }}
            >
              <Box
                component="img"
                src={section.imageUrl}
                alt={section.name}
                onError={(e: any) => { e.target.src = "https://placehold.co/400x200?text=No+Image"; }}
                sx={{ width: "100%", height: 140, objectFit: "cover" }}
              />
              <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
                <Typography fontWeight={600} fontSize={15} noWrap title={section.name}>
                  {section.name}
                </Typography>
                <Chip
                  label={section.isActive ? "Active" : "Inactive"}
                  size="small"
                  sx={{
                    background: section.isActive ? "#22c55e" : "#94a3b8",
                    color: "#fff", fontWeight: 600, fontSize: 11, ml: 1,
                  }}
                />
              </Box>
            </Box>
          ))
        )}
      </Box>

      {/* Categories Section */}
      {selectedSection && (
        <Box mt={4}>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <Typography variant="h6" fontWeight={600}>
              Categories — {selectedSection.name}
            </Typography>
            <Tooltip title="Clear">
              <IconButton
                size="small"
                onClick={() => { setSelectedSection(null); setCategories([]); }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          {catLoading ? (
            <CircularProgress size={28} />
          ) : categories.length === 0 ? (
            <Typography color="text.secondary">No categories found.</Typography>
          ) : (
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 2 }}>
              {categories.map((cat) => (
                <Box
                  key={cat.id}
                  sx={{
                    background: "#fff",
                    borderRadius: 2,
                    border: "1px solid #e2e8f0",
                    p: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                  }}
                >
                  <Box>
                    <Typography fontWeight={600} fontSize={14}>{cat.name}</Typography>
                    <Typography fontSize={11} color="text.secondary">{cat.slug}</Typography>
                  </Box>
                  <Chip
                    label={cat.isActive ? "Active" : "Inactive"}
                    size="small"
                    sx={{
                      background: cat.isActive ? "#22c55e" : "#94a3b8",
                      color: "#fff", fontWeight: 600, fontSize: 11,
                    }}
                  />
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
  // return (
  //   <Box>
  //     {/* Header */}
  //     <Box display="flex" alignItems="center" gap={1} mb={3}>
  //       <CategoryIcon color="primary" />
  //       <Typography variant="h5" fontWeight={600}>Catalog Sections</Typography>
  //     </Box>

  //     {/* Cards Grid */}
  //     <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 3 }}>
  //       {sections.length === 0 ? (
  //         <Typography color="text.secondary">No sections found.</Typography>
  //       ) : (
  //         sections.map((section) => (
  //           <Box
  //             key={section.id}
  //             sx={{
  //               background: "#fff",
  //               borderRadius: 3,
  //               border: "1px solid #e2e8f0",
  //               boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  //               overflow: "hidden",
  //               transition: "box-shadow 0.2s",
  //               "&:hover": { boxShadow: "0 6px 20px rgba(0,0,0,0.1)" },
  //             }}
  //           >
  //             {/* Image */}
  //             <Box
  //               component="img"
  //               src={section.imageUrl}
  //               alt={section.name}
  //               onError={(e: any) => { e.target.src = "https://placehold.co/400x200?text=No+Image"; }}
  //               sx={{ width: "100%", height: 140, objectFit: "cover" }}
  //             />

  //             {/* Body */}
  //             <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
  //               <Typography fontWeight={600} fontSize={15} noWrap title={section.name}>
  //                 {section.name}
  //               </Typography>
  //               <Chip
  //                 label={section.isActive ? "Active" : "Inactive"}
  //                 size="small"
  //                 sx={{
  //                   background: section.isActive ? "#22c55e" : "#94a3b8",
  //                   color: "#fff",
  //                   fontWeight: 600,
  //                   fontSize: 11,
  //                   ml: 1,
  //                 }}
  //               />
  //             </Box>
  //           </Box>
  //         ))
  //       )}
  //     </Box>
  //   </Box>
  // )
}
