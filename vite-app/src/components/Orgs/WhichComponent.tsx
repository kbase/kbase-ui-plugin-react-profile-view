import { ErrorView, Loading } from '@kbase/ui-components';
import { Component } from 'react';
import { AsyncFetchStatus } from '../../redux/asyncFetchState';
import { OrgsState } from '../../redux/interfaces';
import Orgs from './Orgs';



// export default function WhichComponent(props: any) {
//     switch (props.orgFetchStatus) {
//         case 'none':
//             return <Spinner />;
//         case 'fetching':
//             return <Spinner />;
//         case 'success':
//             return <Orgs orgList={props.orgList} />;
//         case 'error':
//             return <ErrorMessage errorMessageProps={props} />;
//         default:
//             return <div>???</div>;
//     }
// }
interface LoaderProps {
    orgsState: OrgsState
    // narratives: Array<NarrativeData> | Array<number | string>;
    // loading: boolean;
    // isOwner: boolean;
}
export default class Loader extends Component<LoaderProps> {
    render() {
        switch (this.props.orgsState.status) {
            case AsyncFetchStatus.NONE:
            case AsyncFetchStatus.FETCHING:
                return <Loading message="Loading Organizations..." />
            case AsyncFetchStatus.ERROR: {
                const error = {
                    code: 'error',
                    message: this.props.orgsState.error.message
                };
                return <ErrorView error={error} />
            }
            case AsyncFetchStatus.SUCCESS: {
                const { orgs } = this.props.orgsState.value;
                return <Orgs orgs={orgs} />

            }
        }
    }
}

