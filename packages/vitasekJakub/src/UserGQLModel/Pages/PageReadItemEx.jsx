import { MegaphoneFill, PencilFill, PlusLg } from "react-bootstrap-icons"
import { SimpleCardCapsuleRightCorner } from "../../../../_template/src/Base/Components"
import { ReadItemURI } from "../Components"
import { UpdateLink } from "../Mutations/Update"
import { ReadAsyncAction } from "../Queries"
import { UserMembershipsTable } from "../Vectors/UserMemberships"
import { PageReadItem } from "./PageReadItem"
import { UserRolesTable } from "../Vectors/UserRoles"
import { CreateUserInserMembershipButton } from "../Mutations/AddMembership"

export const UserMembershipsURI = ReadItemURI.replace("view", "memberships")

export const PageReadUserMemberships = ({ 
    queryAsyncAction=ReadAsyncAction
}) => (
    <PageReadItem queryAsyncAction={queryAsyncAction} SubPage={UserMembershipsTableSubPage}/>
)

const UserMembershipsTableSubPage = ({ item }) => {
    const isoNow = new Date().toISOString()
    const isoNowZ = isoNow.slice(0, isoNow.length - 1)

    // const item = {
    //     userId: item?.id,
    //     user: item,
    //     startdate: isoNowZ
    // }
    console.log("item", item)
    return (
        <UserMembershipsTable item={item}>
            {/* <SimpleCardCapsuleRightCorner>
                ČLENSTVÍ
                <CreateUserInserMembershipButton 
                    item={{...item, __token: "CreateUserInserMembershipButton"}} 
                    className="btn btn-sm btn-link"
                    item={item}
                >
                    <PlusLg />
                </CreateUserInserMembershipButton>
                
            </SimpleCardCapsuleRightCorner> */}
        </UserMembershipsTable>
    )
}

export const UserRolesURI = ReadItemURI.replace("view", "roles")

export const PageReadUserRoles = ({ 
    queryAsyncAction=ReadAsyncAction
}) => (
    <PageReadItem queryAsyncAction={queryAsyncAction} SubPage={UserRolesTableSubPage}/>
)

const UserRolesTableSubPage = ({ item }) => (
    <UserRolesTable item={item}>
        <SimpleCardCapsuleRightCorner>
            <UpdateLink item={item} className="btn btn-sm btn-link">
                <PencilFill />
            </UpdateLink>
        </SimpleCardCapsuleRightCorner>
    </UserRolesTable>
)