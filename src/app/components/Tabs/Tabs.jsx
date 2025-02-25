import { TabsProvider, useTabs} from "./TabsContext.jsx";
import * as S from "./styles.js";

export const Tabs = ({children, defaultIndex}) => {
    return <TabsProvider defaultIndex={defaultIndex}>{children}</TabsProvider>
}

export const TabList = ({children}) => {
    return <S.TabList>{children}</S.TabList>
}

export const Tab = ({index, children}) => {
  const {activeTab, setActiveTab} = useTabs();
  console.log(activeTab, index, activeTab == index);
    return (
        <S.Tab active={activeTab == index} onClick={() => setActiveTab(index)}>
            {children}
        </S.Tab>
    )
}

export const TabPanel = ({index, children}) => {
  const {activeTab} = useTabs();
    return activeTab === index ? <S.TabPanel >{children}</S.TabPanel> : null
}

