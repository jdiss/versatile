if(process.env.BROWSER) require('./blog-roll.scss');
import { h, Component } from 'preact';
import { observer } from 'mobx-observer';

const dateFormatOpts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

@observer
class Blog extends Component {

    componentWillMount() {
        this.context.store.getBlogRoll();
    }

    render() {
        const { store } = this.context;
        if(store.blogRoll) {
            return (
                <div class="row wrap blog-roll">
                    <main class="page-main col-xs-12 col-sm-12 col-md-8">
                        <dl>
                            {
                                store.blogRoll.reduce((acc, entry) => (acc.concat([
                                    <dt><a href={`/${entry.path}`}>{ entry.title }</a></dt>,
                                    <dd>
                                        <p class="date">{ new Intl.DateTimeFormat('en-NL', dateFormatOpts).format(new Date(entry.time)) }</p>
                                        { entry.description && <p>{ entry.description }</p> }
                                    </dd>
                                ])), [])
                            }
                        </dl>
                    </main>
                </div>
            )
        }
        return null;
    }
}

export default Blog;