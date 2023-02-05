class UsperIndex {
    getUser = ({ name, dsc, event, priority, rule }) => {
        return {
            name: name ? name : 'xiuxian',
            dsc: dsc ? dsc : 'xiuxian',
            event: event ? event : 'message',
            priority: priority ? priority : 400,
            rule
        }
    }
}
export default new UsperIndex()