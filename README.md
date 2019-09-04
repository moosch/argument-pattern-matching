# Function pattern matching

Function pattern matching is a very powerful tool found in other languages. It lets you defined functions with the same name but with different arguments and contents.

For example (in Elixir)

```elixir
def my_fn(first_name, last_name) do
  "Hello #{first_name} #{last_name}"
end

def my_fn(first_name) do
  "Hello #{first_name}"
end
```

Now calling `my_fn("Wil")` returns `"Hello Wil"` and calling `my_fn("Wil", "Wheaton")` returns `"Hello Wil Wheaton"`. Pretty simple and yes it's a contrived example but it shows a lot of power.

To take this further we could do pattern matching over function arguments by datatype. Imagine that!

```typescript
function myFn(a: Number, b: Number): Number {
  return a + b;
}

function myFn(a: String, b: Number): String {
  return `${a} is ${b}`;
}
```

Now we know that this will not run as the same function name has been used twice, but pretty cool if it did right?

Through the power of JavaScript we can make it happen...kinda...ish.

## Usage

```javascript
const fpm = require('./fpm');
const defMyConcatFunc = fpm('myConcatFunc');

// Define some match cases
defMyConcatFunc.add = (a = Array, b = Number) =>
  a.concat([b]);

defMyConcatFunc.add = (a = Array, b = Number, c = String) =>
  a.concat([b]).concat([c]);

defMyConcatFunc.add = (a = Array, b = Number, c = Number) =>
  a.concat([b + c]);

// Run your function
myConcatFunc([1], 1, 5); // => [1, 6]
myConcatFunc([], 1); // => [1]
myConcatFunc([1], 1, '5'); // => [1, 1, '5']
```

### Improvements

- [ ] Add arguments.length to possibly improve speed of checking

- [ ] Store the function name, argument sets and function in AST style might be more performant



