import _ from 'lodash';
import React from 'react';

const Number = ({n, isEliminated, isAGuess, isNextSuggestion, isFoundAnswer, ...rest}) =>
    <span style={{
        display: 'inline-block',
        width: 40,
        height: 40,
        color: isFoundAnswer ? 'green' : isAGuess ? 'red' : isEliminated ? 'lightgray' : 'black',
        fontSize: 12,
        cursor: isEliminated || isAGuess || isFoundAnswer ? 'default' : 'pointer',
        textDecoration: isNextSuggestion ? 'underline' : 'initial',
        textDecorationColor: 'blue',
    }} {...rest}>{n}</span>

const range = _.range(1, 301)
const needle = _.sample(range)
console.log(needle)

function App() {
    const [knownMin, setKnownMin] = React.useState(1)
    const [knownMax, setKnownMax] = React.useState(_.max(range))
    const [found, setFound] = React.useState(false)
    const nextSuggestion = Math.trunc((knownMax + knownMin) / 2)
    const [numbers, setNumbers] = React.useState(range.reduce((acc, n) => {
        acc.push({
            n: n,
            isEliminated: false,
            isAGuess: false,
        })

        return acc
    }, []))

    const guess = n => {
        setNumbers(numbers.map(num => {
            return num.n === n
                ? {...num, isAGuess: true}
                : {
                    ...num,
                    isEliminated: num.isEliminated || (((n > needle && num.n > n) || (n < needle && num.n < n) || (n === needle)) ? true : false)
                }
        }))

        if (n > needle) {
            setKnownMax(n)
        } else if (n < needle) {
            setKnownMin(n)
        } else {
            setKnownMax(n)
            setKnownMin(n)
            setFound(true)
        }
    }

    return (
        <>
            <div style={{maxWidth: 1000, margin: '0 auto 30px auto', }}>
                <h1>Guess The Number</h1>
                <p>This game was created for educational purposes. I think for a number and expect you to find it. So
                    make a guess and click on it.</p>
                <p>If you don't have a better idea, I give you my word. If you listen to me, we will find the number
                    on {Math.ceil(Math.log2(range.length))} <code>round(log2(300))</code> tries at most.</p>
                <p>Or, maybe you should try sequential search...</p>
            </div>
            <div style={{display: 'flex', flexWrap: 'wrap', maxWidth: 1000, margin: '0 auto'}}>
                {numbers.map(num => (
                    <Number
                        key={num.n}
                        onClick={() => {
                            !found && !num.isEliminated && !num.isAGuess && guess(num.n)
                        }}
                        isFoundAnswer={needle === num.n && num.isAGuess}
                        isNextSuggestion={num.n === nextSuggestion}
                        {...num}
                    />
                ))}
            </div>
            <div style={{textAlign: 'center'}}>Binary search suggestion: <span
                style={{color: 'blue', fontWeight: 'bold'}}>{nextSuggestion}</span></div>
        </>
    );
}

export default App;
