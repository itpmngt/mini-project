import React, {createContext, useState, useContext} from "react"
import styled from "styled-components";

const MetricsChartsContext = createContext({})

export const MetricsChartsProvider = ( {children} ) => {

    const [activeMetricsChart, setActiveMetricsChart] = useState('years')

    return (

        <MetricsChartsContext.Provider value={{activeMetricsChart, setActiveMetricsChart}}>
            {children}
        </MetricsChartsContext.Provider>

    );
}

export const useMetricsCharts = () => {

    const context = useContext(MetricsChartsContext)

    if (!context)
        throw new Error('useMetricsCharts must be used within a MetricsChartsProvider');

    return context

}
