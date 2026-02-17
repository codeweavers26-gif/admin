import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import SectionPage from "./SectionPage";
import CategoryPage from "./CategoryPage";
import SubCategoryPage from "./SubCategoryPage";
import AttributePage from "./AttributePage";

const CATALOG_ORDER = ["SECTION", "CATEGORY", "SUB_CATEGORY", "ATTRIBUTE"] as const;

const TAB_DATA: Record<string, { label: string }> = {
  SECTION: { label: "Section" },
  CATEGORY: { label: "Category" },
  SUB_CATEGORY: { label: "Sub Category" },
  ATTRIBUTE: { label: "Attribute" },
};

export default function CatalogMainPage() {
  const [selectedTab, setSelectedTab] = useState<(typeof CATALOG_ORDER)[number]>("SECTION");
  const [selections, setSelections] = useState<Record<string, string | null>>({});

  const handleOpenCategory = (sectionId: string) => {
    setSelections({
      SECTION: sectionId,
      CATEGORY: null,
      SUB_CATEGORY: null,
      ATTRIBUTE: null,
    });

    setSelectedTab("CATEGORY");
  };

  const handleOpenSubCategory = (categoryId: string) => {
    setSelections((prev) => ({
      ...prev,
      CATEGORY: categoryId,
      SUB_CATEGORY: null,
      ATTRIBUTE: null,
    }));

    setSelectedTab("SUB_CATEGORY");
  };

  const renderContent = () => {
    switch (selectedTab) {
      case "SECTION":
        return <SectionPage onOpenCategory={handleOpenCategory} />;

      case "CATEGORY":
        if (!selections.SECTION) return null;
        return (
          <CategoryPage sectionId={selections.SECTION!} onOpenSubCategory={handleOpenSubCategory} />
        );

      case "SUB_CATEGORY":
        if (!selections.CATEGORY) return null;
        return (
          <SubCategoryPage categoryId={selections.CATEGORY!} />
        );

      case "ATTRIBUTE":
        return <AttributePage />;

      default:
        return null;
    }
  };

  return (
    <Box>
      {/* Tabs */}
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        {CATALOG_ORDER.map((k, index) => {
          const isDisabled =
            k !== "SECTION" && !selections[CATALOG_ORDER[index - 1]];

          return (
            <React.Fragment key={k}>
              <Button
                size="small"
                variant={selectedTab === k ? "contained" : "outlined"}
                disabled={isDisabled}
                onClick={() => setSelectedTab(k)}
              >
                {TAB_DATA[k].label}
              </Button>

              {index < CATALOG_ORDER.length - 1 && (
                <Box sx={{ mx: 0.5 }}>➝</Box>
              )}
            </React.Fragment>
          );
        })}
      </Box>

      {/* Page Content */}
      <Box>
        {renderContent()}
      </Box>
    </Box>
  );
}
