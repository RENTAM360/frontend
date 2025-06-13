"use client"

import { useMemo } from "react"
import { useGetEquipmentsQuery, type EquipmentQueryParams } from "@/lib/redux/api/equipmentApi"

export function useEquipments(params?: EquipmentQueryParams) {
  const { data, error, isLoading, isFetching, isSuccess, isError, refetch } = useGetEquipmentsQuery(params)

  const equipments = useMemo(() => {
    return data?.equipments || []
  }, [data])

  const totalCount = useMemo(() => {
    return data?.totalCount || 0
  }, [data])

  // Get unique categories from the equipment data
  const categories = useMemo(() => {
    const uniqueCategories = new Set(equipments.map((item) => item.category))
    return Array.from(uniqueCategories).filter(Boolean)
  }, [equipments])

  return {
    equipments,
    totalCount,
    categories,
    error,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    refetch,
    // Helper states
    isEmpty: isSuccess && equipments.length === 0,
    hasData: isSuccess && equipments.length > 0,
  }
}

// Hook for getting categories dynamically from API data
export function useEquipmentCategories() {
  const { categories, isLoading, isError } = useEquipments()

  return {
    categories: ["All", ...categories],
    isLoading,
    isError,
  }
}
