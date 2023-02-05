class UsperIndex {
    getUser = ({ name = 'xiuxian', dsc = 'xiuxian', event = 'message', priority = 400, rule }) => {
        return { name, dsc, event, priority, rule }
    }
}
export default new UsperIndex()