# Where should the next coffee shop go?

An interactive map that answers one commercial question: a coffee chain
has eight outlets and money for a ninth. Given a month of delivery
orders, where should it go?

**The data is synthetic.** The company, the outlets and the orders are
invented. The coordinates are real Islamabad locations, so the map reads
correctly, but nothing here describes a real business. It is a worked
example of a method, not a client case study.

## What it does

Three layers, each answering a different question.

- **Existing outlets** — where we already serve.
- **Orders, clustered** — where the individual orders came from. Click
  into a cluster to check a hotspot is real rather than one large order.
- **Demand, as a heatmap** — where demand *concentrates*, weighted by
  order value rather than order count.

The answer sits in the gap between the heat and the outlets.

## The finding

Two areas come up warm with no outlet nearby.

**E-11** has the largest number of orders anywhere on the map, 210, with
the nearest shop about 2.4 km away. But the baskets are small — roughly
Rs. 169,000 in total.

**Bahria Town** has only 140 orders, but much larger baskets, roughly
Rs. 280,000, and the nearest shop is 7.5 km away.

So the two versions of the heatmap disagree. Weighted by order value,
Bahria is the hotter spot. Count orders alone and E-11 wins. Both are
correct; they answer different questions. Toggle the two radius settings
in the layer control and watch the recommendation move.

The map does not decide. It puts the trade-off in front of someone who
can, which is the most a map should do.

## Built with

Leaflet, Leaflet.markercluster and Leaflet.heat. Vanilla JavaScript, no
build step, no framework. It is a folder of static files.

## How to build a map like this
If you want to learn how to make maps like this, that support real life scenarios in decision making. Here is a link to my paid udemy course.
https://www.udemy.com/course/leafletjs-for-beginners-build-interactive-web-maps-2026/?referralCode=

## Licence

MIT — see [LICENSE](LICENSE).
