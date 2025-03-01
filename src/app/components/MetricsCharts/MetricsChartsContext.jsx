import React, {createContext, useState, useContext} from "react";

const MetricChartsContext = createContext({});

export const MetricChartsProvider = ({children, defaultIndex = 0}) => {

    const [activeMetricChart, setActiveMetricChart] = useState(defaultIndex);

    return (
        <MetricChartsContext.Provider value={{activeMetricChart, setActiveMetricChart}}>
            {children}
        </MetricChartsContext.Provider>
    );
}

export const useMetricCharts = () => {

    const context = useContext(MetricChartsContext);

    if (!context) {

        throw new Error('useMetricCharts must be used within a MetricChartsProvider');

    }

    return context;

}
