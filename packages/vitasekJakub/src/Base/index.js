import { Attribute } from "./Components/Attribute";
import { CardCapsule } from "./Components/CardCapsule";
import { LargeCard } from "./Components/LargeCard";
import { Link } from "./Components/Link";
import { MediumCard } from "./Components/MediumCard";
import { MediumContent } from "./Components/MediumContent";
// import { Page } from "./Pages/Page";
import { Page } from "./Pages/Page";
import { MediumCardScalars } from "./Scalars/ScalarAttribute";
import { MediumCardVectors } from "./Vectors/VectorAttribute";

export const BaseUI = {
    Link,
    Attribute,
    CardCapsule,
    MediumCard,
    MediumContent,
    MediumEditableContent: MediumContent,
    MediumCardScalars,
    MediumCardVectors,
    LargeCard,
    Page
}

export * from "./Components"
export * from "./FormControls"
export * from "./Helpers"
export * from "./Mutations"
export * from "./Pages"
export * from "./Queries"
export * from "./Scalars"
export * from "./Vectors"