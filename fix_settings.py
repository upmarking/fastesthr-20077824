import re

with open('src/pages/Settings.tsx', 'r') as f:
    content = f.read()

content = content.replace("const b = await err.context.json()", "const b = await (err as any).context.json()")

with open('src/pages/Settings.tsx', 'w') as f:
    f.write(content)
