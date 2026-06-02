import { useSearchParams } from "react-router"
import { useDispatch } from 'react-redux';
import { useState } from "react"
import { createAsyncGraphQLAction, hookGraphQLResult, updateItemsFromGraphQLResult } from "@hrbolek/uoisfrontend-gql-shared"

const UserSearchQuery =
    `
query UserSearch($skip: Int, $limit: Int, $where: UserInputWhereFilter) {
  result: userPage(skip: $skip, limit: $limit, where: $where) {
    __typename
 id
 lastchange
    fullname
    roles {
      id
      roletype {
        id
        name
      }
      group {
        id
        name
        grouptype {
          name
        }
      }
    }
  }
  }
`

const UserSearchAsyncAction = createAsyncGraphQLAction(
    UserSearchQuery,
    updateItemsFromGraphQLResult,
    hookGraphQLResult(jsonResult => jsonResult?.data?.result || [])
)

export const UserInputSearchResult = ({result, onSelect, selectedId}) => {
    return (
        <span
            className={`btn btn-outline-primary btn-sm${selectedId === result?.id ? " active text-white bg-primary border-primary" : ""}`}
            style={{ marginRight: 4, marginBottom: 4 }}
            onClick={() => onSelect(result)}
        >
        {result?.fullname}
    </span>
    )
}

export const UserInputSearchResults = ({results, onSelect, selectedId}) => {

    return (
        <>{results.map(result => (
            <UserInputSearchResult
                key={result?.id}
                result={result}
                onSelect={onSelect}
                selectedId={selectedId}
            />
        ))}
        </>
    );
}

export const UserInputSearch = ({onSelect}) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useDispatch()
    const [state, setState] = useState({
        searchphrase: searchParams.get('searchphrase') || "",
        results: [],
        selected: null
    })

    const load = async (searchphrase) => {
        if (searchphrase.length < 3) return []
        const found = await dispatch(UserSearchAsyncAction({
            // where: {fullname: {_ilike: `%${state.searchphrase}%`}}
            where: {_or: [{name: {_ilike: `%${searchphrase}%`}}, {surname: {_ilike: `%${searchphrase}%`}}] }
        }))
        setState(prev => ({...prev, results: found}))
    }

    const onChange = (e) => {
        const value = e.target.value
        setState(prev => {
            return {...prev, searchphrase: value}
        })
        // setSearchParams({...searchParams, searchphrase: value})
        // setState({...prev, searchphrase: value})
        load(value)
    }

    const _onSelect = (user) => {
        setState(prev => ({...prev, selected: user}))
        if (onSelect) onSelect(user)
    }

    return (
        <div>
            <input type="text" className={"form-control"} value={state.searchphrase} onChange={onChange} />
            {/* <hr />
            {JSON.stringify(state)} */}
            <hr />
            <UserInputSearchResults results={state.results} onSelect={_onSelect} selectedId={state.selected?.id} />
        </div>
    )
}