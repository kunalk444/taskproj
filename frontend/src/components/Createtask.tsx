
function Createtask(props:any) {
    const {stopShow} = props;
  return (
    <div>
            <button
                onClick={stopShow}
            >
                X
            </button>
            <input
                type="text"
                placeholder="enter task title"
                minLength={1}
                maxLength={100}
            />
            <textarea>
                
            </textarea>
    </div>
  )
}

export default Createtask